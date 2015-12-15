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

*/
var compiler = (function() {

  generators = (function() {
    var vec,mat;

    //uses template for generate common n-times operation code
    //:TODO: create 2-variable forEach, and inline-ecs(syntax: $(ec.) ). for complex index
    function forEach(dim, template, joiner) {
      if(!joiner) joiner = '';
      return Array.apply(null, Array(dim)).map(function(e,i){
        var t = template.replace(/\$\(.*?\)/g,function(m){
          return (new Function(
            'return '+m.substr(2,m.length-3).replace('i',i) ))()
          });
        return t.replace(new RegExp('\\$i','g'), i)
      }).join(joiner);
    }

    vec={
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
        basic: ['create','clone','copy','add','sub','scaleAndAdd','dot','scale','scaleI',
          'angleDot','projection','length','normalize','normalizeI','plane','flip'],
      },
    };

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
          'traspose','trasposeI','identity','rotateAxis','translate',
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
    mat.identity.args = 'o'
    mat.rotateAxis.args = 'o,a,b,e'
    mat.translate.args = 'o,v'
    mat.scale.args = 'o,m,v'
    mat.multiplyVec.args = 'o,m,v'
    mat.multiplyVecPre.args = 'o,m,v'
    mat.orthogonalizeI.args = 'm'
    mat.projectionPerspective.args = 'o'
    mat.projectionOrthogonal.args = 'o'
    return {
      vec: vec,
      mat: mat,
    }
  })()

  code = function code(descriptor) {
    var generator,mod;

    if(descriptor instanceof Number || typeof descriptor === 'number') {
      code({dim:descriptor})
      return
    }
    if(!descriptor.module) {
      if(!NMath['vec'+descriptor.dim])
        NMath['vec'+descriptor.dim] = {};
      if(!NMath['mat'+descriptor.dim])
        NMath['mat'+descriptor.dim] = {};
      code({dim:descriptor.dim,module:'vec'})
      code({dim:descriptor.dim,module:'mat'})
    }
    else if(!descriptor.func) {
      generators[descriptor.module].subsets.basic.forEach(function(e){
        code({
          dim:descriptor.dim,
          module:descriptor.module,
          func:e
        })
      })
    }
    else {
      generator = generators[ descriptor.module ][ descriptor.func ];
      mod = NMath[descriptor.module+descriptor.dim]
      try {
      NMath[ descriptor.module + descriptor.dim ][ descriptor.func ] =
        (generator.args)?
          Function( generator.args, generator( descriptor.dim )):
          Function( generator( descriptor.dim ))//function body
        }
      catch(e) {
          console.log('Bug compiling: ',descriptor, '\nCode:'+generator( descriptor.dim ));
        }
    }
  }

return {
  generators: generators,
  code: code
}
})();

module.exports = compiler;
