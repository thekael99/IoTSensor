from __future__ import print_function 
import numpy as np
import matplotlib.pyplot as plt
from scipy.spatial.distance import cdist
np.random.seed(11)
N = 10 
x0 = np.random.uniform(15, 50, N)
x1 = np.random.uniform(30, 70, N)
delta = np.random.uniform(-5, 5, N)
y = 2.2 * x0 - 0.9 * x1 + delta
X = np.array(list(zip(x0, x1)))
print(N)
print(X)
print(delta)
print(y)
f = open("data.csv", "w")
for i in range(N):
    f.write(str(X[i][0]) + ", " + str(X[i][1]) + ", " + str(y[i]) + "\n")

f.close()