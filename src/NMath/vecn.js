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

vec={
  isNull: function(dim) {
    return 'if('+forEach(dim,'v[$i]==0','&&')+') return true; return false;'
  },
  create: function(dim) {
    return 'return new '+ARRAY_TYPE_STR+'('+dim+');';
  },
  clone: function (dim) {
    return 'var o=new '+ARRAY_TYPE_STR+'('+dim+');'+
    forEach(dim,'o[$i]=a[$i];')+
    'return o'
  },
  copy: function (dim) {
    return forEach(dim,'a[$i]=b[$i];')
  },
  add: function(dim) {
    return forEach(dim,'o[$i]=a[$i]+b[$i];')
  },
  sub: function(dim) {
    return forEach(dim,'o[$i]=a[$i]-b[$i];')
  },
  scaleAndAdd: function(dim) {
    return forEach(dim,'o[$i]=a[$i]+b[$i]*c;')
  },
  dot: function(dim) {
    return 'return '+forEach(dim,'a[$i]*b[$i]','+')
  },
  scale: function(dim) {
    return forEach(dim,'o[$i]=v[$i]*a;')
  },
  //scaling in-place
  scaleI: function(dim) {
    return forEach(dim,'v[$i]*=a;')
  },
  //generates a projection over b axis
  //o = b/b.length*( dot/b.length ) = b*(dot/(b.length^2)) = b*(dot/(b.dot))
  projection: function(dim) {
    return 'var r=('+forEach(dim,'a[$i]*b[$i]','+')+ //relation = dot
      ')/('+forEach(dim,'b[$i]*b[$i]','+')+ // /b.dot
      ');'+
      forEach(dim,'o[$i]=b[$i]*r;');
  },
  //angle from dot product: acos(dot/a.length*b.length)
  angleDot: function(dim) {
    return 'return Math.acos(('+forEach(dim,'a[$i]*b[$i]','+')+
      ')/(Math.sqrt('+forEach(dim,'a[$i]*a[$i]','+')+
      ')*Math.sqrt('+forEach(dim,'b[$i]*b[$i]','+')+')))'
  },
  length: function(dim) {
    return 'return Math.sqrt('+forEach(dim, 'v[$i]*v[$i]','+')+')'
  },
  normalize: function(dim) {
    return 'var l='+forEach(dim,'i[$i]*i[$i]','+')+';'+
      'l>0&&(l=1/Math.sqrt(l),'+forEach(dim,'o[$i]=i[$i]*l',',')+')'
  },
  normalizeI: function(dim) {
    return 'var l='+forEach(dim,'v[$i]*v[$i]','+')+';'+
      'l>0&&(l=1/Math.sqrt(l),'+forEach(dim,'v[$i]*=l',',')+')'
  },
  //converts 2 vectors into perpendicular plane directors
  plane: function(dim) {
    return 'var t=this.create();'+
      'this.projection(t,a,b);'+
      'this.sub(a,a,t);'+
      'this.normalizeI(a);'+
      'this.normalizeI(b);'
  },
  flip: function(dim) {
    return 'var r=('+
      forEach(dim,'a[$i]*b[$i]','+')+')/Math.sqrt('+
      forEach(dim, "b[$i]*b[$i]",'+')+');'+
      forEach(dim,"o[$i]=a[$i]+2*(b[$i]*r-a[$i]);")
  },
  subsets: {
    basic: ['isNull','create','clone','copy','add','sub','scaleAndAdd','dot','scale','scaleI',
      'angleDot','projection','length','normalize','normalizeI','plane','flip'],
  },
};

vec.isNull.args = 'v';
vec.clone.args = 'a';
vec.copy.args = 'a,b';
vec.add.args = 'o,a,b';
vec.sub.args = 'o,a,b';
vec.scaleAndAdd.args = 'o,a,b,c';
vec.dot.args = 'a,b';
vec.projection.args = 'o,a,b';
vec.angleDot.args = 'a,b';
vec.scale.args = 'o,v,a';
vec.scaleI.args = 'v,a';
vec.length.args = 'v';
vec.normalize.args = 'o,i';
vec.normalizeI.args = 'v';
vec.plane.args = 'a,b';
vec.flip.args = 'o,a,b';
