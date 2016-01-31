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


mat4 = (function() {

    function rotationPlane(out, v1, v2, theta, print) {
      var tmp_v1 = new vec4.create();

      vec4.rotateOnPlane(tmp_v1, [1,0,0,0], v1, v2, theta, print);
      NMath.common.copy(out, tmp_v1, 0, 4);

      vec4.rotateOnPlane(tmp_v1, [0,1,0,0], v1, v2, theta, print);
      NMath.common.copy(out, tmp_v1, 4, 4);

      vec4.rotateOnPlane(tmp_v1, [0,0,1,0], v1, v2, theta, print);
      NMath.common.copy(out, tmp_v1, 8, 4);

      vec4.rotateOnPlane(tmp_v1, [0,0,0,1], v1, v2, theta, print);
      NMath.common.copy(out, tmp_v1, 12, 4);
    };
  //camera projection matrices

    function projectionLen(out, alfa, beta, near, far) {
      var x = near*Math.tan(alfa/2),
        y = near*Math.tan(beta/2);
        console.log('here')
      mat4.projection(out, -x, x, -y, y, near, far);
    };

    function projection(out, left, right, back, front, near, far) {
      out[0] = 2*near/(right-left);
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;

      out[4] = 0;
      out[5] = 2*near/(front-back);
      out[6] = 0;
      out[7] = 0;

      out[8] = (-(right+left))/(right-left);
      out[9] = (-(front+back))/(front-back);
      //out[18] = (near+far)/(far-near);  //the unlinear approach
      out[10] = 2/(far-near);
      out[11] = 1;

      out[12] = 0;
      out[13] = 0;
      //out[23] = -2*far*near/(far-near); //the unlinear approach
      out[14] = -(far+near)/(far-near);
      out[15] = 0;
    };

    function ortogonalLen(out, length, aspect_x, aspect_y, position) {
      var x = length*aspect_x/2,
        y = length*aspect_y/2,
        z = length/2;

      mat4.ortogonal(out, -x, x, -y, y, -z, z);
    }

    function ortogonal(out, left, right, bottom, top, near, far) {
      out[0] = 2/(right-left);
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;

      out[4] = 0;
      out[5] = 2/(top-bottom);
      out[6] = 0;
      out[7] = 0;

      out[8] = 0;
      out[9] = 0;
      out[10] = 2/(far-near);
      out[11] = 0;

      out[12] = -(right+left)/((right-left));
      out[13] = -(top+bottom)/(top-bottom);
      out[14] = -(far+near)/(far-near);
      out[15] = 1;
    }

    return {
      rotationPlane: rotationPlane,
      projection: projection,
      ortogonal: ortogonal,
      projectionLen: projectionLen,
      ortogonalLen: ortogonalLen,
    }
})()

/*
i dont really remember why i had to save this thing.... it will be
probably be cleared in some time

mat4.projectionLen = function(out, alfa, beta, near, far) {
  var x = near*Math.tan(alfa/2),
    y = near*Math.tan(beta/2);
    console.log('here')
  mat4.projection(out, -x, x, -y, y, near, far);
};
mat4.ortogonalLen = function(out, length, aspect_x, aspect_y, position) {
  var x = length*aspect_x/2,
    y = length*aspect_y/2,
    z = length/2;

  mat4.ortogonal(out, -x, x, -y, y, -z, z);
}
mat4.projection = function(out, left, right, back, front, near, far) {
  out[0] = 2*near/(right-left);
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;

  out[4] = 0;
  out[5] = 2*near/(front-back);
  out[6] = 0;
  out[7] = 0;

  out[8] = -(right+left)/(right-left);
  out[9] = -(front+back)/(front-back);
  //out[18] = (near+far)/(far-near);  //the unlinear approach
  out[10] = 2/(far-near);
  out[11] = 1;

  out[12] = 0;
  out[13] = 0;
  //out[23] = -2*far*near/(far-near); //the unlinear approach
  out[14] = -(far+near)/(far-near);
  out[15] = 0;
};
mat4.ortogonal = function(out, left, right, bottom, top, near, far) {
  out[0] = 2/(right-left);
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;

  out[4] = 0;
  out[5] = 2/(top-bottom);
  out[6] = 0;
  out[7] = 0;

  out[8] = 0;
  out[9] = 0;
  out[10] = 2/(far-near);
  out[11] = 0;

  out[12] = -(right+left)/(right-left);
  out[13] = -(top+bottom)/(top-bottom);
  out[14] = -(far+near)/(far-near);
  out[15] = 1;
}
*/
