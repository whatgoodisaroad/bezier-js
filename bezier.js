// General Bézier Curve, any number of dimensions or control points
// 
// All math from http://en.wikipedia.org/wiki/B%C3%A9zier_curve#Generalization
// 
// The approximate function inspired by 
// http://www.flong.com/texts/code/shapers_bez/

// Create a bezier function with a list of points. Each point must me a vector
// of its coordinates. All such vectors should have the same cardinality.
// 
// e.g new Bezier([ [0, 0], [0.75, 0.25], [1, 1] ])
function Bezier(points) {
  points = points;

  var 
    // Order is the number of points.
    // e.g. order = 2 ==> Linear
    //            = 3 ==> Quadratic
    //            = 4 ==> Cubic
    //            = 5 ==> Quartic
    //            = 6 ==> Quintic
    //              etc...
    order = points.length,

    // Cardinality is the number of dimensions for the point vectors.
    cardinality = points[0].length,

    // Number of refinement iterations for the approximator. Larger 
    // numbers ==> greater precision. Appropriate  values depend somewhat on 
    // how extreme the slope of your curve gets, how much precision you need 
    // and how much speed you need. Larger values slow things down 
    // significantly.
    refinement = 10;

  this.setPoints = function(_points) {
    points = _points;
  };

  this.setPoint = function(idx, point) {
    points[idx] = point;
  };

  this.setRefinementIterations = function(n) {
    refinement = n;
  };  

  // Compute the curve value as a vector for some t
  this.b_t = function(t) {
    var 
      n = order - 1,
      b = new_vec();

    for (var i = 0; i <= n; ++i) {
      b = vec_add(
        b, 
        sca_mul(
          b_i_n_t(i, n, t),
          points[i]
        )
      );
    }

    return b;
  };

  // Compute the curve differential as a vector for some t.
  // i.e. [ dx_1, dx_2, ..., dx_n ]
  this.differential_t = function(t) {
    var 
      n = order - 1,
      g = new_vec();

    for (var i = 0; i <= n - 1; ++i) {
      g = vec_add(
        g,
        sca_mul(
          b_i_n_t(i, n - 1, t),
          vec_sub(
            points[i + 1],
            points[i]
          )
        )
      );
    }

    return sca_mul(n, g);
  };

  // Compute the derivative for two variables for some t.
  // For example, in 2 dimensions, if we have x_1 is x and x_2 is y, then
  // dy/dx at t is my_beezier.derivative_t(0, 1, t)
  //
  // More simply, it just computes the ratio of components of the 
  // differential vector. Errors where slope is infinite.
  this.derivative_t = function(ix, iy, t) {
    var g = this.differential_t(t);

    if (g[ix] === 0) {
      return 0;
    }
    else {
      return g[iy] / g[ix];
    }
  };

  // Approximate the bezier as a function assuming that the cardinality is 2.
  // 
  // For example, if the Bezier is meant to approximate y = f(x), where x_1 is
  // x and x_2 is y, then y = f(x) ~~ my_bezier.approximate(0, 1, x)
  this.approximate = function(ix, iy, x0) {
    var t = x0, x1, dydx;

    for (var i = 0; i < refinement; ++i) {
      x1 = this.b_t(t)[ix];

      if (x0 === x1) { break; }

      dydx = this.derivative_t(ix, iy, t);

      t -= (x1 - x0) * dydx;
      t = Math.max(0, Math.min(1, t));
    }

    return this.b_t(t)[iy];
  };

  // Shorthand for the 2d approximation scenarios.
  this.y_x = function(x0) {
    return this.approximate(0, 1, x0);
  };
  this.x_y = function(y0) {
    return this.approximate(1, 0, y0);
  };

  // Compute a single Bezier polynomial term.
  function b_i_n_t(i, n, t) {
    return binom(n, i) * Math.pow(t, i) * Math.pow(1 - t, n - i);
  }

  // Sundry helpers.
  function fact(n)       { return n <= 1 ? 1 : n * fact(n - 1); }
  function binom(n, k)   { return fact(n) / (fact(k) * fact(n - k)); }
  function sca_mul(s, v) { return v.map(function(e) { return e * s; }); }
  function vec_add(u, v) { return u.map(function(e,i) { return e + v[i]; }); }
  function vec_sub(u, v) { return u.map(function(e,i) { return e - v[i]; }); }
  function new_vec() {
    var v = [];
    for (var i = 0; i < cardinality; ++i) {
      v.push(0);
    }
    return v;
  }
}
