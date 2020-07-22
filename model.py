import numpy as np
from sklearn.linear_model import LinearRegression
X = [[0, 1], [1, 1], [1, 2], [2, 2], [2, 3]]

y = [0, 6, 7.9, 9.2, 11]

lst = list(zip(X,y))
X = np.array([x[0] for x in lst if x[1] != 0])
y = np.array([x[1] for x in lst if x[1] != 0])
print(X)
print(y)
reg = LinearRegression().fit(X, y)

print(reg.score(X, y))
print(reg.coef_)
print(reg.intercept_)
# reg.predict(np.array([[3, 5]]))
f = open("model", "w")
f.write(str(reg.coef_[0])+"\n")
f.write(str(reg.coef_[1])+"\n")
f.write(str(reg.intercept_))
f.close()