class WheelApp {
    constructor() {
        this.canvas = document.getElementById('wheel');
        this.ctx = this.canvas.getContext('2d');
        this.options = [
            '看电影', '读书', '听音乐', '散步',
            '画画', '写作', '运动', '冥想'
        ];
        
        // 苹果风格配色
        this.colors = [
            '#007AFF', '#5856D6', '#FF2D55', '#FF3B30',
            '#34C759', '#007AFF', '#5856D6', '#FF9500'
        ];
        
        this.isSpinning = false;
        this.currentRotation = 0;
        this.spinButton = document.getElementById('spinButton');
        this.setupEventListeners();
        this.renderOptions();
        this.drawWheel();
    }

    setupEventListeners() {
        this.spinButton.addEventListener('click', () => this.spin());
        document.getElementById('addOption').addEventListener('click', () => this.addOption());
    }

    renderOptions() {
        const optionsList = document.getElementById('optionsList');
        optionsList.innerHTML = '';
        
        this.options.forEach((option, index) => {
            const div = document.createElement('div');
            div.className = 'option-item';
            
            const input = document.createElement('input');
            input.value = option;
            input.addEventListener('change', (e) => {
                this.options[index] = e.target.value;
                this.drawWheel();
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '×';
            deleteBtn.addEventListener('click', () => {
                this.options.splice(index, 1);
                this.renderOptions();
                this.drawWheel();
            });
            
            div.appendChild(input);
            div.appendChild(deleteBtn);
            optionsList.appendChild(div);
        });
    }

    drawWheel() {
        const center = this.canvas.width / 2;
        const radius = center - 10;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.translate(center, center);
        this.ctx.rotate(this.currentRotation);
        
        const sliceAngle = (2 * Math.PI) / this.options.length;
        
        this.options.forEach((option, index) => {
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.arc(0, 0, radius, index * sliceAngle, (index + 1) * sliceAngle);
            this.ctx.closePath();
            
            this.ctx.fillStyle = this.colors[index % this.colors.length];
            this.ctx.fill();
            
            // 绘制文字
            this.ctx.save();
            this.ctx.rotate(index * sliceAngle + sliceAngle / 2);
            this.ctx.textAlign = 'right';
            this.ctx.fillStyle = 'white';
            this.ctx.font = '16px -apple-system';
            this.ctx.fillText(option, radius - 20, 6);
            this.ctx.restore();
        });
        
        this.ctx.restore();
    }

    spin() {
        if (this.isSpinning) return;
        this.isSpinning = true;
        this.spinButton.disabled = true;
        
        // 增加最小旋转圈数，确保至少转8圈
        const minRotations = 8 * 2 * Math.PI;
        const extraRotations = 2 * Math.PI * (Math.random() * 2 + 1); // 额外1-3圈
        const totalRotation = minRotations + extraRotations;
        
        const startTime = performance.now();
        const duration = 8000; // 8秒
        const startRotation = this.currentRotation;
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用更平缓的缓动函数
            const easeOut = (t) => {
                // 前30%加速，后70%减速
                return t < 0.3
                    ? 4 * t * t * t
                    : 1 - Math.pow(-1.429 * t + 1.429, 3);
            };
            
            this.currentRotation = startRotation + totalRotation * easeOut(progress);
            this.drawWheel();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isSpinning = false;
                this.spinButton.disabled = false;
                
                // 计算最终选中的选项
                const normalizedRotation = this.currentRotation % (2 * Math.PI);
                const sliceAngle = (2 * Math.PI) / this.options.length;
                const selectedIndex = Math.floor(
                    (2 * Math.PI - normalizedRotation) / sliceAngle
                ) % this.options.length;
                
                // 显示结果
                setTimeout(() => {
                    alert(`选中了: ${this.options[selectedIndex]}`);
                }, 300);
            }
        };
        
        requestAnimationFrame(animate);
    }

    addOption() {
        if (this.options.length >= 12) {
            alert('最多只能添加12个选项');
            return;
        }
        this.options.push('新选项');
        this.renderOptions();
        this.drawWheel();
    }
}

// 初始化应用
window.addEventListener('DOMContentLoaded', () => {
    new WheelApp();
}); 