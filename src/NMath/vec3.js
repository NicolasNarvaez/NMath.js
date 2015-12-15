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

var vec3 = (function() {

  function rotateNormalizedRelative(obj, va, vb, theta) {
    var mat = NMath.mat,
      mat4 = NMath.mat4,
      vec = NMath.vec,
      vec4 = NMath.vec4,
      m_data_pre = mat4.create(),
      m_data = mat4.create(),
      m_rotation = mat4.createIdentity(),
      m_tmp = mat4.create(),
      vecs = null;

    mat.fromVecs(m_data, [obj.rx, obj.ry, obj.rz]);
    m_data[15] = 1.0;

    if(va === obj.rz && vb === obj.ry)
      NMath.mat4.rotateAxis(m_rotation, 2,1, theta)
    else if(va === obj.rz && vb === obj.rx)
      NMath.mat4.rotateAxis(m_rotation, 2,0, theta)
    else
      return;

    mat4.multiply(m_tmp, m_rotation, m_data);
    mat.from(m_data_pre, m_tmp);

    vecs = mat.vecs(m_data_pre);
    obj.rx = vecs[0];
    obj.ry = vecs[1];
    obj.rz = vecs[2];
  }

  return {
    rotateNormalizedRelative: rotateNormalizedRelative
  }
})();

module.exports = vec3;
