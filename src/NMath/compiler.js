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

  @import 'vecn.js'

  @import 'matn.js'

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
