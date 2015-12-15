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

var vec4 = (function() {
  /*
  var a = new mat4.create();
  var v1 = [1,1,0,0], v2 = [0,0,1,0];
  vec4.plane(v1,v2);
  mat4.rotationPlane(a, v1, v2, Math.PI/4); console.log(NMath.mat.str(a))
  */
  //rota la projeccion del vector sobre el plano, con sentido desde v1 hacia v2
  function rotateOnPlane(out, v, v1, v2, theta) {
    var v_perpendicular = new vec4.create(),
      tmp_v1 = new vec4.create(),
      tmp_v2 = new vec4.create(),
      v1_close, v2_close, rotated = false,
      v1p, v2p;


    //obtener componente perpendicular (v_perpendicular)
    //console.log('entrada',v);
    vec4.projection(tmp_v1, v, v1);
    //console.log('projeccion en v1',tmp_v1);
    vec4.sub(tmp_v1, v, tmp_v1);
    vec4.projection(tmp_v2, tmp_v1, v2);
    //console.log('projeccion en v2',tmp_v2);
    vec4.sub(v_perpendicular, tmp_v1, tmp_v2);
    //console.log('perpendicular',v_perpendicular);

    //tmp_v1 is vector projection
    vec4.sub(tmp_v1, v, v_perpendicular);
    //console.log('projeccion',tmp_v1);


    if( !(vec4.length(tmp_v1)/vec4.length(v1)) ) {
      vec4.copy(out, v)
      return;
    }

    vec4.projection(tmp_v2, tmp_v1, v1);
    v1p = vec4.length(tmp_v2)/vec4.length(v1);
    if(vec4.angleDot(tmp_v1, v1) >= Math.PI/2)
      v1p *= -1;

    vec4.projection(tmp_v2, tmp_v1, v2);
    v2p = vec4.length(tmp_v2)/vec4.length(v2);
    if(vec4.angleDot(tmp_v1, v2) >= Math.PI/2)
      v2p *= -1;

    vec4.scale(out, v1,
      v1p*Math.cos(theta) - v2p*Math.sin(theta));
    vec4.scaleAndAdd(out, out, v2,
      v2p*Math.cos(theta) + v1p*Math.sin(theta));

    vec4.add(out,out,v_perpendicular);
  }

    //aplica rotadores relativos a rotación global segmentada para generar rotación total
    function rotateAbsolute(obj) {
      var mat5 = NMath.mat5,
        mat = NMath.mat,
        rwz = mat4.createIdentity(),
        rwy = mat4.createIdentity(),
        rwx = mat4.createIdentity(),
        m_data_pre = mat4.create(),
        m_data = mat4.create(),
        m_tmp1 = mat4.create(),
        m_tmp2 = mat4.create(),
        vecs = null;

      mat.fromVecs(m_data, [obj.rrx, obj.rry, obj.rrz, obj.rrw]);
      mat4.rotateAxis(rwz, 3,2, obj.rwz)
      mat4.rotateAxis(rwy, 3,1, obj.rwy)
      mat4.rotateAxis(rwx, 3,0, obj.rwx)

      mat4.multiply(m_tmp1, rwz, rwx);
      mat4.multiply(m_tmp2, rwy, m_tmp1);
      mat4.multiply(m_tmp1, m_data, m_tmp2);

      vecs = mat.vecs(m_tmp1);

      obj.rx = vecs[0];
      obj.ry = vecs[1];
      obj.rz = vecs[2];
      obj.rw = vecs[3];
    }

    function rotateNormalizedRelative(vecs, a,b ,theta) {
      //console.log('relative')
      var mat = NMath.mat,
        mat5 = NMath.mat5,
        vec = NMath.vec,
        m_data = mat5.create(),
        m_rotation = mat5.createIdentity(),
        m_rotation2 = mat5.create(),
        m_tmp = mat5.create();

      mat.fromVecs(m_data, vecs);

      mat5.rotateAxis(m_rotation, a, b, theta);

      mat5.multiply(m_tmp, m_data, m_rotation);
      vec.fromMat(vecs, m_tmp);
    }

    //rota v hacia p theta ang
    function rotatePivot(out, v, p, theta) {
      var v_norm = new vec4.create(),
        pivot = new vec4.create();

      //console.log('rotatePivot entrada [vec, piv]:', v, p);

      vec4.projection(v_norm, p, v);
      //console.log('projecion de piv en v',v_norm);
      vec4.sub(v_norm, p, v_norm);
      //console.log('pivote componente perpendicular',v_norm);
      vec4.normalize(pivot, v_norm);
      //console.log('pivote normalizado',pivot);
      //pivot is the normalized perpendicular to v part of p

      vec4.normalize(v_norm, v);

      vec4.rotateNormalized(pivot,v_norm, theta);
      vec4.scale(out, v_norm, vec4.length(v));
      //console.log('v rotado',out);
    }

    //rota va hacia vb el angulo theta
    function rotateNormalized(va, vb, theta) {
      var tmp = vec4.clone(va),
        x = Math.cos(theta)-1,
        y = Math.sin(theta);

      va[0] += va[0]*x - vb[0]*y;
      va[1] += va[1]*x - vb[1]*y;
      va[2] += va[2]*x - vb[2]*y;
      va[3] += va[3]*x - vb[3]*y;

      vb[0] += vb[0]*x + tmp[0]*y;
      vb[1] += vb[1]*x + tmp[1]*y;
      vb[2] += vb[2]*x + tmp[2]*y;
      vb[3] += vb[3]*x + tmp[3]*y;
    };


  return {
    rotateOnPlane: rotateOnPlane,
    rotateAbsolute: rotateAbsolute,
    rotateNormalizedRelative: rotateNormalizedRelative,
    rotatePivot: rotatePivot,
    rotateNormalized: rotateNormalized,
  }
})();

module.exports = vec4;
