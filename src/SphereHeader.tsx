import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PHOTOS = [
  '01.jpg','02.gif','03.jpg','04.jpg','05.gif','06.jpg','07.jpg',
  '08.jpg','09.jpg','10.gif','11.jpg','12.jpg','13.gif','14.jpg',
  '15.jpg','16.gif','17.gif','18.jpg','19.jpg','20.jpg','21.jpg',
  '22.jpg','23.jpg','24.jpg','25.gif','26.jpg','27.jpg','28.jpg',
  '29.jpg','30.jpg','31.jpg',
].map(f => `/sphere-photos/${f}`);

interface GifTracker { tick: (now: number) => void }

export function SphereHeader({ subtitle }: { subtitle: string }) {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const headerRef   = useRef<HTMLElement>(null);
  const textRef     = useRef<HTMLDivElement>(null);
  const loadbarRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas    = canvasRef.current!;
    const headerEl  = headerRef.current!;
    const headerText = textRef.current!;
    const loadbar   = loadbarRef.current!;

    // Scene
    const scene  = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(innerWidth, innerHeight);
    const group = new THREE.Group();
    scene.add(group);

    const RADIUS = 2.2, COUNT = 50, MAX_SIZE = 0.7;

    function fibonacciSphere(i: number, total: number) {
      const golden = Math.PI * (3 - Math.sqrt(5));
      const y = 1 - (i / (total - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      return new THREE.Vector3(r * Math.cos(golden * i), y, r * Math.sin(golden * i));
    }

    const gifTextures: GifTracker[] = [];
    let _gifuct: any = null;

    function isGif(url: string) {
      return url.endsWith('.gif');
    }

    async function getGifuct() {
      if (!_gifuct) _gifuct = await import('https://cdn.jsdelivr.net/npm/gifuct-js@2.1.2/+esm' as any);
      return _gifuct;
    }

    async function loadGif(url: string, onReady: (tex: THREE.Texture, w: number, h: number) => void) {
      const { parseGIF, decompressFrames } = await getGifuct();
      const buffer = await fetch(url).then(r => r.arrayBuffer());
      const gif = parseGIF(buffer);
      const frames = decompressFrames(gif, true);
      const w = gif.lsd.width, h = gif.lsd.height;
      const cvs = document.createElement('canvas');
      cvs.width = w; cvs.height = h;
      const ctx = cvs.getContext('2d')!;
      const bitmaps = await Promise.all(
        frames.map((f: any) => createImageBitmap(new ImageData(new Uint8ClampedArray(f.patch), w, h)))
      );
      const texture = new THREE.CanvasTexture(cvs);
      texture.colorSpace = THREE.SRGBColorSpace;
      ctx.drawImage(bitmaps[0], 0, 0);
      texture.needsUpdate = true;
      let fi = 0, lastTime = performance.now();
      gifTextures.push({
        tick(now: number) {
          const delay = Math.max((frames[fi].delay || 10) * 10, 20);
          if (now - lastTime >= delay) {
            ctx.clearRect(0, 0, w, h);
            ctx.drawImage(bitmaps[fi], 0, 0);
            texture.needsUpdate = true;
            fi = (fi + 1) % frames.length;
            lastTime = now;
          }
        }
      });
      onReady(texture, w, h);
    }

    function loadMedia(url: string, onReady: (tex: THREE.Texture, w: number, h: number) => void) {
      if (isGif(url)) {
        loadGif(url, onReady);
      } else {
        new THREE.TextureLoader().load(url, (texture) => {
          texture.colorSpace = THREE.SRGBColorSpace;
          onReady(texture, texture.image.width, texture.image.height);
        });
      }
    }

    function buildSphere(urls: string[]) {
      group.clear();
      gifTextures.length = 0;
      let loaded = 0;
      loadbar.style.display = 'block';
      loadbar.style.width = '0%';
      for (let i = 0; i < COUNT; i++) {
        const dir = fibonacciSphere(i, COUNT);
        const pos = dir.clone().multiplyScalar(RADIUS);
        const geo = new THREE.PlaneGeometry(MAX_SIZE, MAX_SIZE);
        const mat = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.visible = false;
        mesh.position.copy(pos);
        mesh.lookAt(new THREE.Vector3(0, 0, 0));
        mesh.rotateY(Math.PI);
        mesh.rotateZ((Math.random() - 0.5) * 0.6);
        mesh.position.copy(pos);
        group.add(mesh);
        loadMedia(urls[i % urls.length], (texture, iw, ih) => {
          const aspect = iw / ih;
          const w = aspect >= 1 ? MAX_SIZE : MAX_SIZE * aspect;
          const h = aspect >= 1 ? MAX_SIZE / aspect : MAX_SIZE;
          mesh.geometry.dispose();
          mesh.geometry = new THREE.PlaneGeometry(w, h);
          mat.map = texture;
          mat.needsUpdate = true;
          mesh.visible = true;
          loaded++;
          loadbar.style.width = (loaded / COUNT * 100) + '%';
          if (loaded === COUNT) setTimeout(() => { loadbar.style.display = 'none'; }, 400);
        });
      }
    }

    buildSphere(PHOTOS);

    let scrollProgress = 0;
    const onScroll = () => {
      const runway = headerEl.offsetHeight - window.innerHeight;
      scrollProgress = Math.min(Math.max(window.scrollY / runway, 0), 1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let isDragging = false, prevMouse = { x: 0, y: 0 };
    const onMouseDown = (e: MouseEvent) => { isDragging = true; prevMouse = { x: e.clientX, y: e.clientY }; };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      group.rotation.y += (e.clientX - prevMouse.x) * 0.005;
      group.rotation.x += (e.clientY - prevMouse.y) * 0.005;
      prevMouse = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => { isDragging = false; };
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseUp);

    const onResize = () => {
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    };
    window.addEventListener('resize', onResize);

    let animId: number;
    function animate() {
      animId = requestAnimationFrame(animate);
      const p = scrollProgress;
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      group.scale.setScalar(Math.max(1 - eased * 1.15, 0));
      if (!isDragging) {
        const speed = 0.003 + p * 0.035;
        group.rotation.y += speed;
        group.rotation.x += speed * 0.15;
      }
      headerText.style.opacity = String(Math.max((p - 0.75) / 0.25, 0));
      const now = performance.now();
      gifTextures.forEach(({ tick }) => tick(now));
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseUp);
      renderer.dispose();
    };
  }, []);

  return (
    <header className="sphere-header" ref={headerRef}>
      <div className="sticky-scene">
        <canvas ref={canvasRef} className="sphere-canvas" />
        <div className="header-text" ref={textRef}>
          <div className="sphere-headline">
            <span className="word-social">Social</span>
            <span className="word-presences">presences</span>
          </div>
          <p className="sphere-subtitle">{subtitle}</p>
          <span className="sphere-arrow">↓</span>
        </div>
        <div className="sphere-loadbar" ref={loadbarRef} />
      </div>
    </header>
  );
}
