/**
  * For optimization puposes, all functions will do in-place operations over
  * out vector parameter (unless the end in 'I'), or out matrix parameter, this way, you will
  * have to use temporary matrixes for some cases, likes for example, matrix multiplication. <br/>
  *
  * @module NMath
*/

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

var ARRAY_TYPE = Float32Array || Array,
  ARRAY_TYPE_STR = (Float32Array)? 'Float32Array' : 'Array',
  GLINDEX_ARRAY_TYPE =  Uint16Array || Array,
  GLCOLOR_UI8_ARRAY_TYPE = Uint8Array || Array,
  GLCOLOR_F32_ARRAY_TYPE = Float32Array || Array,
  GLCOLOR_ARRAY_TYPE = GLCOLOR_F32_ARRAY_TYPE;

module.exports = {
  ARRAY_TYPE_STR: ARRAY_TYPE_STR,
  ARRAY_TYPE: ARRAY_TYPE
}
