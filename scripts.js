const container = document.getElementById("container");
const ballCountInput = document.getElementById("ballCount");
const startButton = document.getElementById("startButton");
let balls = []; // 存储所有的球
let animationId; // 用于保存请求帧的ID

// 生成球的函数
function createBall() {
    const ball = document.createElement("div");
    const size = Math.random() * 30 + 10; // 随机大小（10px到40px）
    ball.style.width = size + "px";
    ball.style.height = size + "px";
    ball.style.backgroundColor = getRandomColor(); // 随机颜色
    ball.className = "ball";
    
    // 随机初始位置
    ball.style.left = Math.random() * (container.clientWidth - size) + "px";
    ball.style.top = Math.random() * (container.clientHeight - size) + "px";
    
    // 随机速度
    const speedX = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 1);
    const speedY = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 1);
    
    balls.push({ element: ball, position: { x: parseFloat(ball.style.left), y: parseFloat(ball.style.top) }, speed: { x: speedX, y: speedY } });
    container.appendChild(ball); // 将球添加到容器中
}

// 随机颜色生成函数
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// 动画函数
function animate() {
    balls.forEach(ball => {
        ball.position.x += ball.speed.x; // 更新X坐标
        ball.position.y += ball.speed.y; // 更新Y坐标

        // 碰撞检测与反弹
        if (ball.position.x + ball.element.offsetWidth > container.clientWidth || ball.position.x < 0) {
            ball.speed.x = -ball.speed.x; // 在X方向反弹
        }
        if (ball.position.y + ball.element.offsetHeight > container.clientHeight || ball.position.y < 0) {
            ball.speed.y = -ball.speed.y; // 在Y方向反弹
        }

        // 检测与其他球的碰撞
        balls.forEach(otherBall => {
            if (ball !== otherBall) {
                const dx = ball.position.x - otherBall.position.x;
                const dy = ball.position.y - otherBall.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistance = (ball.element.offsetWidth + otherBall.element.offsetWidth) / 2;

                if (distance < minDistance) {
                    // 改变颜色
                    ball.element.style.backgroundColor = getRandomColor();
                    otherBall.element.style.backgroundColor = getRandomColor();

                    // 简单反弹逻辑（交换速度）
                    const tempSpeedX = ball.speed.x;
                    const tempSpeedY = ball.speed.y;
                    ball.speed.x = otherBall.speed.x;
                    ball.speed.y = otherBall.speed.y;
                    otherBall.speed.x = tempSpeedX;
                    otherBall.speed.y = tempSpeedY;
                }
            }
        });

        // 更新球的位置
        ball.element.style.left = ball.position.x + "px"; // 设置左边距
        ball.element.style.top = ball.position.y + "px"; // 设置上边距
    });

    animationId = requestAnimationFrame(animate); // 请求下一帧动画
}


// 开始动画的事件处理程序
startButton.addEventListener("click", () => {
    const ballCount = parseInt(ballCountInput.value); // 获取用户输入的球的数量
    balls.forEach(ball => container.removeChild(ball.element)); // 移除之前的球
    balls = []; // 清空球的数组

    for (let i = 0; i < ballCount; i++) {
        createBall(); // 根据用户输入的数量生成球
    }
    
    // 开始动画
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
    animate();
});