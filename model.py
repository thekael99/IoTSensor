import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

data = np.array(pd.read_csv("data.csv", header=None))
X = np.array(data[:, :2]).reshape((-1, 2))
y = np.array(data[:,-1])
print(X)
print(y)

lst = list(zip(X,y))
X = np.array([x[0] for x in lst if x[1] != 0])
y = np.array([x[1] for x in lst if x[1] != 0])

reg = LinearRegression().fit(X, y)

print(reg.score(X, y))
print(reg.coef_)
print(reg.intercept_)
reg.predict(np.array([[3, 5]]))
f = open("model", "w")
f.write(str(reg.coef_[0])+"\n")
f.write(str(reg.coef_[1])+"\n")
f.write(str(reg.intercept_))
f.close()