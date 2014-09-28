# bezier-js

A Bezier curve calculator and approximator for any degree and any 
dimensionality. For example, a 2-dimensional Bezier curve of three points (i.e. 
a quadratic Bezier) might be initialized in the following way:

    var curve = new Bezier([ [0, 0], [0.75, 0.25], [1, 1] ]);

## Methods

#### `new Bezier([...])`: Constructor

Accepts a list of control points, each represented as a vector.

For example, to define a 2-dimensional cubic Bezier, provide a list of 4 control 
points, each control point being a vector of length 2.

    var curve = new Bezier([
      [x_0, y_0],
      [x_1, y_1],
      [x_2, y_2],
      [x_3, y_3]
    ]);

For a 4-dimensional quartic Bezier, provide a list of 5 control points, each 
being a vector of length 4:

    var curve = new Bezier([ 
      [x_0, y_0, z_0, w_0], 
      [x_1, y_1, z_1, w_1], 
      [x_2, y_2, z_2, w_2],
      [x_3, y_3, z_3, w_3],
      [x_4, y_4, z_4, w_4]
    ]);

Note: It will break if vectors of varying lengths are provided.

#### `curve.setPoints([...])`: Set the list of control points

Set the list of control points on an existing Bezier curve object.

#### `curve.setPoint(index, [...])`: Set a specific control point

Redefine a specific control point of an existing Bezier curve object, identified
by its index in the control point list. For example, we can change the middle 
control point of the 2-dimensional quadratic Bezier example from above:

    var curve = new Bezier([ [0, 0], [0.75, 0.25], [1, 1] ]);

    curve.setPoint(1, [ 0.25, 0.75 ]);

#### `curve.b_t(t)`: Compute the point along the curve for some `t` value

This is the parametric interface to the Bezier curve. To find the points along
the curve, collect the points produced by `b_t` for some sequence of `t` values 
between `0` and `1`.

For example, to get the the points along some curve (in whatever dimensionality)
with a resolution of 100, one could write the following:

    var points = [];
    for (var t = 0; t < 1; t += 1/100) {
      points.push(
        curve.b_t(t)
      );
    }

Each point returned by `b_t` will be a vector of the same dimensionality as the 
original curve.

#### `curve.differential_t(t)`: Compute the differential vector for some `t` value

Parametric function to compute a vector representing the infinitesimal rates of 
change of each dimension at some `t` value between `0` and `1`.

For example, the differential vector for some n-dimensional curve at some value 
`t` would be:

    curve.differential_t(t)
      // ==> [ dx_1, dx_2, ..., dx_n ]

#### `curve.derivative_t(ix, iy, t)`: Compute the derivative for two variables for some `t` value

For example, in 2 dimensions, if we have x_1 is x and x_2 is y, then dy/dx at 
`t` is `curve.derivative_t(0, 1, t)`

More simply, it just computes the ratio of components of the differential 
vector. The components are identified by the indices provided in the `ix` and 
`iy` arguments.

Will error when slope is infinite because `dx` will be zero.

#### `curve.approximate(ix, iy, x0)`: Approximate the components of a 2-dimensional curve

Assuming that the curve is 2-dimensional, create an approximation of a function 
interface. Insofar as Bezier curves are inherently parametric (i.e. along the 
`t` parameter) one might want to use a curve like it was a 2-d function 
(assuming that the curve is 2-dimensional, and is function-like in that it has 
no infinite slopes).

For example, if the curve is meant to approximate *y = f(x)*, where `x_1` is
*x* and `x_2` is *y*, then *y = f(x) ≈* `curve.approximate(0, 1, x)`.

This function uses a bijective approximation method with a certain number of 
refinement iterations.

#### `curve.setRefinementIterations(n)`: Change the number of bijection iterations

Change the number of iterations the bijective approximator will undergo before
yielding a value. By default it is set to 10, but this may need to change 
depending somewhat on how extreme the slope gets, how much precision is needed 
and how much speed is needed.

Larger numbers mean greater precision and slower performance. 

#### `curve.y_x(x)` and `curve.x_y(y)`: Approximation shorthand

Shorthand for the two 2-dimensional approximation scenarios (i.e. approximate
*y* for *x* or approximate *x* for *y*).

    this.y_x = function(x0) {
      return this.approximate(0, 1, x0);
    };
    this.x_y = function(y0) {
      return this.approximate(1, 0, y0);
    };

## Where Credit is Due

* All the necessary math is conveniently here: http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Generalization
* The approximator adapted from http://www.flong.com/texts/code/shapers_bez/