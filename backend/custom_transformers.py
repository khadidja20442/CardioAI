import pandas as pd
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin


class StSlopeFixer(BaseEstimator, TransformerMixin):
    def __init__(self, column="st_slope", invalid_value=0):
        self.column = column
        self.invalid_value = invalid_value

    def fit(self, X, y=None):
        if not isinstance(X, pd.DataFrame):
            raise TypeError("StSlopeFixer expects a pandas DataFrame.")

        s = X[self.column]
        s_valid = s[(s != self.invalid_value) & (~s.isna())]
        self.mode_ = s_valid.mode()[0] if len(s_valid) > 0 else self.invalid_value
        return self

    def transform(self, X):
        if not isinstance(X, pd.DataFrame):
            raise TypeError("StSlopeFixer expects a pandas DataFrame.")

        X = X.copy()
        X[self.column] = X[self.column].replace(self.invalid_value, self.mode_)
        return X


class OutlierCapper(BaseEstimator, TransformerMixin):
    def __init__(self, columns):
        self.columns = columns

    def fit(self, X, y=None):
        if not isinstance(X, pd.DataFrame):
            raise TypeError("OutlierCapper expects a pandas DataFrame.")

        self.bounds_ = {}
        for col in self.columns:
            q1 = np.nanpercentile(X[col], 25)
            q3 = np.nanpercentile(X[col], 75)
            iqr = q3 - q1
            lower = q1 - 1.5 * iqr
            upper = q3 + 1.5 * iqr
            self.bounds_[col] = (lower, upper)
        return self

    def transform(self, X):
        if not isinstance(X, pd.DataFrame):
            raise TypeError("OutlierCapper expects a pandas DataFrame.")

        X = X.copy()
        for col in self.columns:
            lower, upper = self.bounds_[col]
            X[col] = np.where(X[col] < lower, lower, X[col])
            X[col] = np.where(X[col] > upper, upper, X[col])
        return X