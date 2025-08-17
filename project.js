<script>
    // Basic responsive canvas animation: smooth floating + subtle rotation of three shapes
    (function(){
    const canvas = document.getElementById('viewerCanvas');
    const poster = document.getElementById('posterImg');
    const wrap = document.getElementById('viewerWrap');

    function resize() {
    canvas.width = wrap.clientWidth;
    canvas.height = wrap.clientHeight;
}
    window.addEventListener('resize', resize);
    resize();

    const ctx = canvas.getContext('2d');

    // Option: if you have a poster image file named 'poster.png', uncomment to use as cover:
    // poster.style.display = 'block';
    // canvas.style.display = 'none';

    function drawRoundedRect(x,y,w,h,r,color,shadow){
    ctx.save();
    if(shadow){
    ctx.shadowColor = "rgba(0,0,0,0.14)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 6;
} else { ctx.shadowBlur = 0; }
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

    function drawCircle(x,y,r,color,shadow){
    ctx.save();
    if(shadow){
    ctx.shadowColor = "rgba(0,0,0,0.12)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 6;
}
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
}

    function draw(){
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0,0,w,h);

    const centerY = h/2;
    const spacing = w / 4;

    const t = performance.now() * 0.001;

    // Lignin - warm brown poly (rounded cube)
    const ligninX = spacing;
    const ligninY = centerY + Math.sin(t*1.1)*10;
    const ligninSize = 70 + Math.sin(t*1.7)*4;
    drawRoundedRect(ligninX - ligninSize/2, ligninY - ligninSize/2, ligninSize, ligninSize, 10, "#8b5a2b", true);

    // Aerogel - dark irregular circle with subtle texture
    const aerogelX = spacing*2;
    const aerogelY = centerY + Math.sin(t*1.3 + 0.8)*12;
    const aerogelR = 58 + Math.sin(t*1.9)*3;
    drawCircle(aerogelX, aerogelY, aerogelR+2, "#0b0b0b", true);
    // tiny pores - dots
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    for(let i=0;i<18;i++){
    const ang = i * (Math.PI*2/18) + (t*0.6);
    const rx = aerogelX + Math.cos(ang)*(aerogelR*0.6) + Math.sin(ang*1.3)*5;
    const ry = aerogelY + Math.sin(ang)*(aerogelR*0.6) + Math.cos(ang*0.9)*4;
    ctx.beginPath(); ctx.arc(rx,ry,1.8,0,Math.PI*2); ctx.fill();
}

    // Supercapacitor - cylindrical stylized shape
    const bodyX = spacing*3;
    const bodyY = centerY + Math.sin(t*1.5 + 1.6)*8;
    const bodyW = 56 + Math.sin(t*1.6)*3;
    const bodyH = 96 + Math.sin(t*1.6)*6;
    // top ellipse
    ctx.save();
    ctx.translate(bodyX, bodyY - bodyH/2);
    ctx.scale(1,0.55);
    ctx.beginPath();
    ctx.ellipse(0,0,bodyW/2,bodyW/2,0,0,Math.PI*2);
    ctx.fillStyle = "#0b63a6";
    ctx.shadowColor = "rgba(0,0,0,0.12)";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.restore();
    // body
    drawRoundedRect(bodyX - bodyW/2, bodyY - bodyH/2 + (bodyW*0.12), bodyW, bodyH - (bodyW*0.12), 8, "#0e6da6", false);
    // top highlight
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(bodyX - bodyW/2 + 6, bodyY - bodyH/2 + 10, bodyW - 12, 8);

    // connecting animated arrows
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.26)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ligninX + ligninSize/2 + 6, ligninY);
    const mid1 = (ligninX + aerogelX)/2;
    ctx.quadraticCurveTo(mid1, ligninY - 30*Math.cos(t*0.6), aerogelX - aerogelR - 6 + Math.sin(t*0.8)*6, aerogelY);
    ctx.stroke();
    // arrow head
    const ax = aerogelX - aerogelR - 6 + Math.sin(t*0.8)*6;
    const ay = aerogelY;
    ctx.beginPath();
    ctx.moveTo(ax,ay);
    ctx.lineTo(ax-8, ay-6);
    ctx.lineTo(ax-8, ay+6);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.26)"; ctx.fill();

    // second arrow
    ctx.beginPath();
    ctx.moveTo(aerogelX + aerogelR + 6, aerogelY);
    const mid2 = (aerogelX + bodyX)/2;
    ctx.quadraticCurveTo(mid2, aerogelY + 28*Math.sin(t*0.5), bodyX - bodyW/2 - 6 + Math.cos(t*0.9)*6, bodyY);
    ctx.stroke();
    // arrow head
    const bx = bodyX - bodyW/2 - 6 + Math.cos(t*0.9)*6;
    const by = bodyY;
    ctx.beginPath();
    ctx.moveTo(bx,by);
    ctx.lineTo(bx-8, by-6);
    ctx.lineTo(bx-8, by+6);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // subtle floating glow
    ctx.save();
    const g = ctx.createRadialGradient(aerogelX, aerogelY, 10, aerogelX, aerogelY, aerogelR*2);
    g.addColorStop(0, "rgba(255,255,255,0.02)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);
    ctx.restore();

    requestAnimationFrame(draw);
}

    requestAnimationFrame(draw);
})();
</script>