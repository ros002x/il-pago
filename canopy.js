/* Original foliage, articulated around five branch pivots. Broad rigid bends preserve
   flower clusters; a smaller tip response trails the breeze. Scroll owns the outer layer. */
(() => {
  'use strict';
  const vertex = `
    attribute vec2 position;
    varying vec2 uv;
    uniform float time, strength, hanging;
    float lobe(vec2 p, vec2 center, vec2 spread) {
      vec2 d = (p-center)/spread; return exp(-dot(d,d));
    }
    vec2 branch(vec2 p, vec2 pivot, float angle) {
      vec2 d = (p-pivot)*vec2(1.0,.667);
      float s=sin(angle), c=cos(angle);
      return (vec2(c*d.x-s*d.y,s*d.x+c*d.y)-d)/vec2(1.0,.667);
    }
    void main() {
      uv = position;
      vec2 p = position;
      vec2 q = mix(p, vec2(1.0-p.x,1.0-p.y), hanging);
      float anchored = smoothstep(0.0,.55,1.0-q.y);
      float a = lobe(q,vec2(.13,.48),vec2(.16,.29));
      float b = lobe(q,vec2(.31,.39),vec2(.17,.29));
      float c = lobe(q,vec2(.51,.56),vec2(.16,.28));
      float d = lobe(q,vec2(.70,.70),vec2(.15,.23));
      float e = lobe(q,vec2(.86,.83),vec2(.13,.18));
      float gust = .65+.35*sin(time*.19+.8);
      float wind = sin(time*.63)+.28*sin(time*1.17+1.3);
      vec2 bend = a*branch(q,vec2(.12,.96),strength*gust*wind)
        + b*branch(q,vec2(.32,.94),strength*(.75*sin(time*.68-.7)+.2*sin(time*1.31)))
        + c*branch(q,vec2(.46,.99),strength*(sin(time*.76-1.9)+.18*sin(time*1.43)))
        + d*branch(q,vec2(.65,1.0),strength*(sin(time*.83-2.8)+.22*sin(time*1.27)))
        + e*branch(q,vec2(.81,1.0),strength*1.2*sin(time*.94-3.9));
      bend /= max(1.0,a+b+c+d+e);
      // Small, delayed leaf-tip flutter; no global UV noise or liquid displacement.
      float tips = a+b+c+d+e;
      bend += vec2(sin(time*1.61+q.x*23.0),.5*sin(time*1.39+q.x*19.0))
        * tips * strength * .065;
      p += bend * anchored * mix(1.0,-1.0,hanging);
      gl_Position = vec4(p.x*2.0-1.0,1.0-p.y*2.0,0.0,1.0);
    }`;
  const fragment = `precision mediump float; varying vec2 uv; uniform sampler2D photo;
    void main() { gl_FragColor = texture2D(photo,uv); }`;
  window.createCanopy = element => {
    const img = element.querySelector('img');
    const canvas = document.createElement('canvas');
    canvas.className = 'canopy-mesh'; canvas.setAttribute('aria-hidden','true');
    const gl = canvas.getContext('webgl', {alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:true,powerPreference:'low-power'});
    if (!gl) return null; // The original image remains a complete fallback.
    let ready=false, dead=false, source='', last=-1;
    const shaders=[];
    const compile=(type,code)=>{const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);shaders.push(s);return s;};
    const program=gl.createProgram();
    gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex));
    gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
    if (!gl.getProgramParameter(program,gl.LINK_STATUS)) { gl.getExtension('WEBGL_lose_context')?.loseContext(); return null; }
    const vertices=[], nx=48, ny=32;
    for(let y=0;y<ny;y++)for(let x=0;x<nx;x++)for(const [dx,dy] of [[0,0],[1,0],[0,1],[0,1],[1,0],[1,1]])vertices.push((x+dx)/nx,(y+dy)/ny);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(vertices),gl.STATIC_DRAW);
    gl.useProgram(program);const position=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);
    const clock=gl.getUniformLocation(program,'time'), strength=gl.getUniformLocation(program,'strength');
    gl.uniform1f(gl.getUniformLocation(program,'hanging'),element.parentElement.matches('.canopy-hanging')?1:0);
    const resize=()=>{if(!img.naturalWidth)return;const width=Math.min(Number(img.getAttribute('width'))||1024,Math.ceil(element.clientWidth*Math.min(devicePixelRatio,1.5)));if(!width)return;canvas.width=width;canvas.height=Math.round(width*img.naturalHeight/img.naturalWidth);gl.viewport(0,0,canvas.width,canvas.height);last=-1;};
    const upload=()=>{if(dead||!img.complete||!img.naturalWidth||source===img.currentSrc)return;try{gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,img);source=img.currentSrc;ready=true;resize();}catch{ready=false;element.classList.remove('mesh-ready');}};
    img.addEventListener('load',upload);element.append(canvas);upload();
    const observer=new ResizeObserver(resize);observer.observe(element);
    const lost=event=>{event.preventDefault();ready=false;element.classList.remove('mesh-ready');};
    canvas.addEventListener('webglcontextlost',lost);
    return {
      render(time,light) {
        if(!ready||dead||time-last<(light?1/30:1/60))return;
        last=time;gl.uniform1f(clock,time);gl.uniform1f(strength,light?.045:.034);
        gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,vertices.length/2);
        element.classList.add('mesh-ready');
      },
      dispose() {dead=true;observer.disconnect();img.removeEventListener('load',upload);canvas.removeEventListener('webglcontextlost',lost);element.classList.remove('mesh-ready');canvas.remove();gl.deleteBuffer(buffer);gl.deleteTexture(texture);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));gl.getExtension('WEBGL_lose_context')?.loseContext();}
    };
  };
})();
