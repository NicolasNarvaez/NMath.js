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

var vec = (function() {
  function create(length) {
    var v = new ARRAY_TYPE(length),
      i=length;
    for(;i--;)
      v[i] = 0;
    return v;
  }

  function createFrom(length, from, offset, from_length) {
    var v = new ARRAY_TYPE(length),
      i = 0,
      offset = (offset)? offset:0,
      from_length = (from_length)? from_length : from.length-offset;

    for(i=length; i--;)
      if(i < from_length)
        v[i] = from[i+offset];
      else
        v[i] = 0;

    return v;
  }

  function from(out, v) {
    for(var i = out.length; i--;)
      out[i] = v[i];
  }

  function fromMat(out, m) {
    var size = mat.size(m),
      x, y;

    for(x = out.length; x--;)
      for(y = out[x].length; y--;)
        if( x<size && y<size )
          out[x][y] = m[x*size+y];
        else
          out[x][y] = 0;
  }

  function str(v, length) {
    var i,
      width_max=(length)?length:0,
      width=0,
      str = '';

    if(!length)
      for(i = v.length; i--;)
        if( (width = (''+v[i]).length) > width_max )
          width_max = width;

    for(i = 0; i < v.length; i++) {
      width = (''+v[i]).substr(0,width_max);
      str += ((v[i] >= 0)?' ':'') + width +
        Array(1+width_max-width.length).join(' ') +
        ((v[i]<0)? ' ':'') + ' , ';
    }

    return str;
  }
  return {
    create: create,
    createFrom: createFrom,
    from: from,
    fromMat: fromMat,
    str: str
  };
})();

module.exports = vec;
