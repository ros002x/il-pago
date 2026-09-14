/* Decorative mesh: three softly weighted branch groups share the original photograph.
   No duplicated edges, replacement scenery or competing scroll transforms. */
(() => {
  'use strict';
  const vertex = `
    attribute vec2 position;
    varying vec2 uv;
    uniform float time, strength, hanging;
    float lobe(vec2 p, vec2 center, vec2 spread) {
      vec2 d = (p-center)/spread; return exp(-dot(d,d));
    }
    void main() {
      uv = position;
      vec2 p = position;
      vec2 q = mix(p, vec2(1.0-p.x,1.0-p.y), hanging);
      float anchored = smoothstep(0.0,.65,1.0-q.y);
      float a = lobe(q,vec2(.27,.40),vec2(.23,.34));
      float b = lobe(q,vec2(.62,.62),vec2(.22,.25));
      float c = lobe(q,vec2(.86,.79),vec2(.18,.22));
      float breeze = sin(time*.43)+.22*sin(time*.97+1.3);
      vec2 bend = vec2(
        a*breeze + b*.8*sin(time*.57+2.1) + c*sin(time*.71+4.3),
        a*.4*sin(time*.38+1.7) + b*.6*sin(time*.63+3.2) + c*.7*sin(time*.83));
      p += bend * anchored * strength;
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
    const vertices=[], nx=28, ny=20;
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
        last=time;gl.uniform1f(clock,time);gl.uniform1f(strength,light?.009:.008);
        gl.clear(gl.COLOR_BUFFER_BIT);gl.drawArrays(gl.TRIANGLES,0,vertices.length/2);
        element.classList.add('mesh-ready');
      },
      dispose() {dead=true;observer.disconnect();img.removeEventListener('load',upload);canvas.removeEventListener('webglcontextlost',lost);element.classList.remove('mesh-ready');canvas.remove();gl.deleteBuffer(buffer);gl.deleteTexture(texture);gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));gl.getExtension('WEBGL_lose_context')?.loseContext();}
    };
  };
})();
