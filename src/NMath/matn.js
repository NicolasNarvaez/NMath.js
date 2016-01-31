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

mat={
  /**
  * creates a zero matrix
  * @function create
  * @memberof matN
  */
  create: function (dim) {
    return 'return new '+ARRAY_TYPE_STR+'('+(dim*dim)+')'
  },
  /**
  * creates an identity matrix
  * @function createIdentity
  * @memberof matN
  */
  createIdentity: function (dim) {
    var s = 'var o=new '+ARRAY_TYPE_STR+'('+(dim*dim)+');', x, y;
    for(x=dim;x--;) for(y=dim;y--;)
      s+= 'o['+(x*dim+y)+']='+(x===y?1:0)+';'
    return s+'return o';
  },
  /**
  * sets out to identity
  * @function identity
  * @memberof matN
  */
  identity: function(dim) {
    var s='',x,y;
    for(x=dim;x--;) for(y=dim;y--;)
      s+= 'o['+(x*dim+y)+']='+(x===y?1:0)+';\n'
    return s;
  },
  isIdentity: function(dim) {
    var s='', x, y;

    s+= 'if(';
    for(x=dim;x--;) for(y=dim;y--;)
      s += ' m['+(x*dim+y)+'] != '+ ((x==y)? '1':'0') + ((x==0&&y==0)?'':'||');

    s+=') return false;';
    s+='return true;'

    return s;
  },
  sum: function(dim) {
    return forEach(dim,'o[$i]=a[$i]+b[$i];')
  },
  sumI: function(dim) {
    return forEach(dim,'a[$i]+=b[$i];')
  },
  /**
  * copy a into out
  * @function copy
  * @memberof matN
  */
  copy: function(dim) {
    return forEach(dim*dim,'a[$i]=b[$i];')
  },
  multiply: function (dim) {
    var s='', o=[], x,y,z;
    for(x = dim; x--;)
    for(y = dim; y--;){
      s += 'o['+((y*dim)+x)+']=';

      for(z = dim, o=[]; z--;)
        o.push('a['+(z*dim+x)+']*b['+(y*dim+z)+']');
      s += o.join('+')+';\n';
    }
    return s;
  },
  /**
  * applies : out = m*v
  * @function multiplyVec
  * @memberof matN
  */
  multiplyVec: function(dim) {
    var i,str='';
    for(i=dim;i--;)
      str += 'o['+i+']='+Array.apply(null, Array(dim)).map(function(e,j){
          return 'm['+(j*dim+i)+']*v['+j+']'
        }).join('+')+';'
    return str;
  },
  multiplyVecPre: function(dim) {
    var i,str='';
    for(i=dim;i--;)
      str += 'o['+i+']='+Array.apply(null, Array(dim)).map(function(e,j){
          return 'm['+(i*dim+j)+']*v['+j+']'
        }).join('+')+';'
    return str;
  },
  normalizeI: function(dim) {
    var i,str='';
    str+='var r;';
    for(i=0;i<dim;i++)
      str+='r=Math.sqrt('+forEach(dim,'o[$i*'+i+']','+')+');';
    return str;
  },
  orthogonalizeI: function(dim){
    var str = 'var r;', i, j, k=dim;
    for(i=0; i<dim; i++)
      for(j=i+1; j<dim; j++)
    str += 'r=('+forEach(dim,'m[$('+(i*dim)+'+i)]*m[$('+(j*dim)+'+i)]','+')+ //relation = dot
      ')/('+forEach(dim,'m[$('+(j*dim)+'+i)]*m[$('+(j*dim)+'+i)]','+')+ // /b.dot
      ');'+
      forEach(dim,'m[$('+(i*dim)+'+i)]-=m[$('+(j*dim)+'+i)]*r;')+'\n\n';  //
    return str;
  },
  /**
  * out = a^T
  * @function traspose
  * @memberof matN
  */
  traspose: function (dim) {
    var s='', x,y;
    for(x=dim;x--;) for(y=dim;y--;)
      s+='o['+(x*5+y)+']=a['+(y*5+x)+'];'
    return s
  },
  /**
  * a = a^T
  * @function trasposeI
  * @memberof matN
  */
  trasposeI: function(dim) {
    var s='var t;', x,y;
    for(x=dim;x--;) for(y=dim;y--;)
      if(y > x){
      s+='t=o['+(y*5+x)+'];'
      s+='o['+(y*5+x)+']=o['+(x*5+y)+'];'
      s+='o['+(x*5+y)+']=t;'
    }
    return s
  },
  /**
  * Function for optimized rotation construction on identity
  * matrix, generates a rotation from 'a' axis to 'b' axis
  * @function rotateIdentityAxis
  * @memberof matN
  */
  rotateAxis: function(dim) {
    return 'var x=Math.cos(e),y=Math.sin(e);'+
      'o[a*'+dim+'+a]=x;o[a*'+dim+'+b]=y;'+
      'o[b*'+dim+'+b]=x;o[b*'+dim+'+a]=-y;';
  },
  /**
  * Will apply a translation transform to m <br/> <br/>
  * m = taslation(p)*m
  * @function translate
  * @memberof matN
  */
  translate: function(dim) {
    var str='', i;
    for(i=dim-1; i--;)
      str +='o['+(dim*(dim-1)+i)+']=v['+i+']+o['+(dim*(dim-1)+i)+'];';
    return str;
  },
  /**
  * Will apply a scaling transform to m and put it into out <br/> <br/>
  * out = scale(v)*m
  * @function scale
  * @memberof matN
  */
  scale: function(dim) {
    var i, j, str='';
    for(i=dim-1; i--;)
      for(j=dim-1;j--;)
        str+='o['+(dim*i+j)+']=m['+(dim*i+j)+']*v['+i+'];';
    return str;
  },
  projectionPerspective: function(dim) {
    if(dim === 1)
      return 'o[0]=0';  //base case

    var str='', i, j, str_x;
    str+='if(arguments.length<3||!o) throw "Insuficient parameters on projection matrix";'
    str+='var d_limit=Math.floor(arguments.length/2), last_index=('+
      (dim*2)+'>arguments.length)?(d_limit-1)*2+1:arguments.length,'+
      'n=arguments[1],f=arguments[2];'+
      'console.log(last_index, d_limit);'

    for(i=dim; i--;) //zeroes
      for(j=dim; j--;)
        if( (i!=j || (i==dim-1 && j==dim-1) ) && i!=dim-2 && !(i==dim-1 && j==dim-2) )
          str+='o['+(i*dim+j)+']=0;';
    //out[x] = (near+far)/(far-near);  //the unlinear approach

    str+='o['+((dim-1)*dim-1)+']=1;'+  //special cases
      'o['+((dim-1)*dim-2)+']=2/(f-n);'+
      'o['+(dim*dim-2)+']=-(f+n)/(f-n);'

    for(i=dim-2;i-- >0;) {
      str+='\nif('+(i+2)+'>d_limit){\n'+
        'o['+((dim-2)*dim+i)+']=(-(arguments[last_index+1]+arguments[last_index]))'+
        '/(arguments[last_index+1]-arguments[last_index]);'+
        'o['+(i*dim+i)+']=(2*n)/(arguments[last_index+1]-arguments[last_index]);'+
      '\n}else{\n'+
        'o['+((dim-2)*dim+i)+']=(-(arguments['+((i+2)*2)+']+arguments['+((i+2)*2-1)+
          ']))/(arguments['+((i+2)*2)+']-arguments['+((i+2)*2-1)+']);'+
        'o['+(i*dim+i)+']=(2*n)/(arguments['+((i+2)*2)+']-arguments['+((i+2)*2-1)+']);'+
      '}'
    }
    return str
  },
  /*
   mat4.projectionLen = function(out, near, far, a, b, ...) {
    var x = near*Math.tan(a/2),
      y = near*Math.tan(b/2);
      console.log('here')
    mat4.projection(out, -x, x, -y, y, near, far);
  };
  mat4.ortogonalLen = function(out, length, aspect_a, aspect_b ...) {
    var x = length*aspect_x/2,
      y = length*aspect_y/2,
      z = length/2;
    mat4.ortogonal(out, -x, x, -y, y, -z, z);
  }
  */
  projectionPerspectiveLen: function(dim) {

  },
  projectionPerspectiveCollapse: function(dim) {

  },
  projectionOrthogonal: function(dim) {
    if(dim === 1)
      return 'o[0]=0';  //base case

    var str='', i, j, str_x;
    str+='if(arguments.length<3||!o) throw "Insuficient parameters on projection matrix";'
    str+='var d_limit=Math.floor(arguments.length/2), last_index=('+
      (dim*2)+'>arguments.length)?(d_limit-1)*2+1:arguments.length,'+
      'n=arguments[1],f=arguments[2];'+
      'console.log(last_index, d_limit);'

    for(i=dim; i--;) //zeroes
      for(j=dim; j--;)
        if( i!=j && i!=dim-1 )
          str+='o['+(i*dim+j)+']=0;';
    //out[x] = (near+far)/(far-near);  //the unlinear approach

    str+='o['+(dim*dim-1)+']=1;'+  //special cases
      'o['+((dim-1)*dim-2)+']=2/(f-n);'+
      'o['+(dim*dim-2)+']=-(f+n)/(f-n);'

    for(i=dim-2;i-- >0;) {
      str+='\nif('+(i+2)+'>d_limit){\n'+
        'o['+((dim-1)*dim+i)+']=(-(arguments[last_index+1]+arguments[last_index]))'+
        '/(arguments[last_index+1]-arguments[last_index]);'+
        'o['+(i*dim+i)+']=2/(arguments[last_index+1]-arguments[last_index]);'+
      '\n}else{\n'+
        'o['+((dim-1)*dim+i)+']=(-(arguments['+((i+2)*2)+']+arguments['+((i+2)*2-1)+
          ']))/(arguments['+((i+2)*2)+']-arguments['+((i+2)*2-1)+']);'+
        'o['+(i*dim+i)+']=2/(arguments['+((i+2)*2)+']-arguments['+((i+2)*2-1)+']);'+
      '}'
    }
    return str
  },
  projectionOrthogonalLen: function(dim) {

  },
  projectionOrthogonalCollapse: function(dim) {

  },
  subsets: {
    basic: ['multiply','create','sum','sumI','copy','createIdentity',
      'traspose','trasposeI','identity','isIdentity','rotateAxis','translate',
      'scale','multiplyVec','multiplyVec','multiplyVecPre',
      'orthogonalizeI','projectionPerspective','projectionOrthogonal'],
  },
};

mat.multiply.args = 'o,a,b'
mat.sum.args = 'o,a,b'
mat.sumI.args = 'a,b'
mat.copy.args = 'a,b'
mat.traspose.args = 'o,a'
mat.trasposeI.args = 'o'
mat.isIdentity.args = 'm'
mat.identity.args = 'o'
mat.rotateAxis.args = 'o,a,b,e'
mat.translate.args = 'o,v'
mat.scale.args = 'o,m,v'
mat.multiplyVec.args = 'o,m,v'
mat.multiplyVecPre.args = 'o,m,v'
mat.orthogonalizeI.args = 'm'
mat.projectionPerspective.args = 'o'
mat.projectionOrthogonal.args = 'o'
