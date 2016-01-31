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
* Common matrix functions
* @module mat
* @memberof NMath
*/
mat = (function() {
  /**
  * Will create a well formated string representing the matrix, ideal for console output
  * @function str
  * @memberof mat
  */
  function str(m, l) {
    var str = '\n',
      l = (!l)? Math.floor(Math.sqrt(m.length+1)+0.05) : l,
      x,y,
      number_width = 1,
      width;
    for(x=l*l; x--;) {
      width = String(m[x]).length;
      if(width > number_width)
        number_width = width;
    }

    for(y=-1; ++y < l; ) {
      for(x=-1; ++x < l; ) {
        width = String(m[(x*l) + y]).length;
        str += m[(x*l) + y] + Array(number_width-width+2).join(' ');
      }
      str += '\n';
    }
    return str;
  }

  function size(m) {
    return Math.floor(Math.sqrt(m.length)+0.5);
  }

  function fromVecs(out, vecs) {
    var size_o = size(out),
      size_v_x = vecs.length, size_v_y,
      x, y;

    for(x = size_o; x--;)
      for(y = size_o, size_v_y = (vecs[x])? vecs[x].length:0; y--;) {
        if( x < size_v_x && y < size_v_y )
          out[x*size_o + y] = vecs[x][y];
        else
          out[x*size_o + y] = 0.0;
        }
  }

  function from(out, m, fill) {
    var size_o = mat.size(out),
      size_m = mat.size(m),
      x, y;

    for(x=size_o;x--;)
      for(y=size_o;y--;)
        if(x < size_m && y < size_m)
          out[x*size_o+y] = m[x*size_m+y];
        else if(fill)
          out[x*size_o+y] = 0.0;
  }

  function vecs(m) {
    var m_size = size(m),
      x=null,
      y=null,
      vecs = Array(m_size);
    for(x = m_size; x--;) {
      vecs[x] = NMath['vec'+m_size].create();
      for(y = m_size; y--;)
        vecs[x][y] = m[x*m_size + y];
    }

    return vecs;
  }

  function invert(o,m) {
    var dim=size(m), c,
      //i: normal diagonal, j: row traversing, k:vertical traversing
      i,j,k, d, //d: current data
      mat=NMath['mat'+dim];

    mat.identity(o);
    c = mat.create();
    mat.copy(c,m);

    for(i=0;i<dim;i++){  //for each diagonal
      d=c[i*dim + i];

      if(d===0) {//if null, find no-null row and switch
        for(k=i+1;k<dim;k++)  if(c[i*dim + k] !== 0)
          for(j=0;j<dim;j++) {
            d=c[j*dim + i];
            c[j*dim + i] = c[j*dim + k];
            c[j*dim + k] = d;

            d=o[j*dim + i];
            o[j*dim + i] = o[j*dim + k];
            o[j*dim + k] = d;
          }

        d=c[i*dim + i];
      }

      for(j=0;j<dim;j++){  //cancelar fila actual
        c[j*dim+i] /= d;
        o[j*dim+i] /= d;
      }

      for(k=0;k<dim;k++){ //eliminar filas restantes
        if(k===i) continue;
        d=c[i*dim+k]; //multiplicador
        if(d===0) continue;

        for(j=0;j<dim;j++) {
          c[j*dim+k] -= c[j*dim+i]*d;
          o[j*dim+k] -= o[j*dim+i]*d;
        }
      }
    }
  }

  return {
    str: str,
    size: size,
    fromVecs: fromVecs,
    from: from,
    vecs: vecs,
    invert: invert,
  };

})();
