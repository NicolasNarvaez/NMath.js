/**
* For optimization puposes, all functions will do in-place operations over
* out vector parameter (unless the end in 'I'), or out matrix parameter, this way, you will
* have to use temporary matrixes for some cases, likes for example, matrix multiplication. <br/>
*
* @module NMath
*/
var ARRAY_TYPE = Float32Array || Array,
  ARRAY_TYPE_STR = (Float32Array)?'Float32Array' : 'Array',
  GLINDEX_ARRAY_TYPE =  Uint16Array || Array,
  GLCOLOR_UI8_ARRAY_TYPE = Uint8Array || Array,
  GLCOLOR_F32_ARRAY_TYPE = Float32Array || Array,
  GLCOLOR_ARRAY_TYPE = GLCOLOR_F32_ARRAY_TYPE;



root.NMath = (function() {

  var mat,mat4,mat5,
    vec,vec3,vec4,vec5,
    common,
    code,
    generatos;

  @import 'compiler.js'

  @import 'common.js'
  @import 'mat.js'
  @import 'mat4.js'
  @import 'mat5.js'

  @import 'vec.js'
  @import 'vec3.js'
  @import 'vec4.js'

  return {
    code: code,
    common: common,

    mat : mat,
    mat4: mat4,
    mat5: mat5,
    vec: vec,
    vec3: vec3,
    vec4: vec4,
    vec5: vec5,

    ARRAY_TYPE: ARRAY_TYPE,
    GLCOLOR_ARRAY_TYPE: GLCOLOR_ARRAY_TYPE,
    GLINDEX_ARRAY_TYPE: GLINDEX_ARRAY_TYPE
  };
})();
