/*
The MIT License (MIT)

Copyright (c) 2015 Nicolás Narváez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
* NSquare matrix lib
* @class matN
* @memberof NMath
*/
mat5 = (function() {
  /**
  * Generates a proyection matrix from angles, one for each perpendicular
  * to viewer axis
  * @function projectionLen
  * @memberof matN
  */
  function projectionLen(out, alfa, beta, gamma, near, far) {
    var x = near*Math.tan(alfa/2),
      y = near*Math.tan(beta/2),
      z = near*Math.tan(gamma/2);
    projection(out, -x, x, -y, y, -z, z, near, far);
  }

  /**
  * Generates a projection matrix from viewing fustrum coordinates
  * @function projection
  * @memberof matN
  */
  function projection(out, left, right, back, front, bottom, top, near, far) {
    out[0] = 2*near/(right-left);
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;

    out[5] = 0;
    out[6] = 2*near/(front-back);
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    //console.log(near, front, back, out[6]);
    out[10] = 0;
    out[11] = 0;
    out[12] = 2*near/(top-bottom);
    out[13] = 0;
    out[14] = 0;

    out[15] = (-(right+left))/(right-left);
    out[16] = (-(front+back))/(front-back);
    out[17] = (-(top+bottom))/(top-bottom);
    //out[18] = (near+far)/(far-near);  //the unlinear approach
    out[18] = 2/(far-near);
    out[19] = 1;

    out[20] = 0;
    out[21] = 0;
    out[22] = 0;
    //out[23] = -2*far*near/(far-near); //the unlinear approach
    out[23] = -(far+near)/(far-near);
    out[24] = 0;
  }

  /**
  * Cuts a matrix into mat4 matrices, ideal to send them into the graphics card.
  * @function inferiorProjection
  * @memberof matN
  */
  function inferiorProjection(out1, out2, a) {
    out1[0] = a[0];
    out1[1] = a[1];
    out1[2] = a[2];
    out1[3] = a[3];
    out2[0] = a[4];

    out1[4] = a[5];
    out1[5] = a[6];
    out1[6] = a[7];
    out1[7] = a[8];
    out2[4] = a[9];

    out1[8] = a[10];
    out1[9] = a[11];
    out1[10] = a[12];
    out1[11] = a[13];
    out2[8] = a[14];

    out1[12] = a[15];
    out1[13] = a[16];
    out1[14] = a[17];
    out1[15] = a[18];
    out2[12] = a[19];

    //vertical line
    out2[1] = a[20];
    out2[5] = a[21];
    out2[9] = a[22];
    out2[13] = a[23];

    out2[2] = a[24];
  }

   return {
    inferiorProjection: inferiorProjection,
    projectionLen: projectionLen,
    projection: projection
  }
})();
