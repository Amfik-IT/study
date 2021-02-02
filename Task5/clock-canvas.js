window.onload = function () {

    function drawClock() {
        blank();
        const clock = document.getElementById('clock');
        let halfWidthClock = clock.offsetWidth / 2;

        if (clock && clock.getContext('2d')) {
            let ctx = clock.getContext('2d');

            // Рисуем большой груг
            ctx.save();
            ctx.shadowColor = '#d8cdcf';
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 25;

            ctx.beginPath();
            ctx.fillStyle = '#282828';
            ctx.strokeStyle = '#00000078';
            ctx.arc(halfWidthClock, halfWidthClock, 250, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
            ctx.restore();

            let img = document.getElementById("photo");
            ctx.drawImage(img, 150, 150, 250, 250);

            ctx.save();

            // Рисуем 12 цифр
            for (let angle = 30; angle <= 360; angle += 30) {

                let radius = halfWidthClock - 65;
                let angleRadians = parseFloat(angle) / 180 * Math.PI;
                let numeralCenterX = halfWidthClock + radius * Math.sin(angleRadians);
                let numeralCenterY = (halfWidthClock + 5) - radius * Math.cos(angleRadians);

                ctx.shadowColor = 'rgba(0,0,0,1)';
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 10;
                ctx.font = 'bold 50px Times-New-Roman';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = '#afafaf';
                ctx.fillText(`${angle/30}`, numeralCenterX, numeralCenterY);
            }
            ctx.restore();

            // Создание 60ти маленьких минутных точек:
            ctx.save();
            for (let angle = 6; angle <= 360; angle += 6) {

                let radius = halfWidthClock - 35;
                let angleRadians = parseFloat(angle) / 180 * Math.PI;
                let CenterX = halfWidthClock + radius * Math.sin(angleRadians);
                let CenterY = halfWidthClock - radius * Math.cos(angleRadians);

                ctx.beginPath();
                ctx.fillStyle = 'rgba(0,0,0,0.75)';
                if (angle % 30 == 0) {
                    ctx.arc(CenterX, CenterY, 2.5, 0, 2 * Math.PI);
                } else {
                    ctx.arc(CenterX, CenterY, 1.5, 0, 2 * Math.PI);
                };
                ctx.fill();

            }
            ctx.restore();

            // Стрелки
            let date = new Date();
            let hour = date.getHours();
            let minute = date.getMinutes();
            let second = date.getSeconds();

            let radius;
            let angleRadians;
            let X;
            let Y;

            // digitalClock
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,1)';
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 10;
            ctx.font = 'bold 30px Times-New-Roman';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#afafaf';

            let secondBefore;
            let minuteBefore;
            if (second < 10) {
                secondBefore = 0;
            } else secondBefore = "";
            if (minute < 10) {
                minuteBefore = 0;
            } else minuteBefore = "";

            ctx.fillText(`${hour}:${minuteBefore}${minute}:${secondBefore}${second}`, halfWidthClock, halfWidthClock + 160);
            ctx.restore();

            // Часовая
            ctx.strokeStyle = 'rgba(0,0,0,0.77)';
            ctx.lineCap = 'round';
            ctx.lineWidth = 10;
            ctx.beginPath();
            ctx.moveTo(halfWidthClock, halfWidthClock);

            radius = halfWidthClock * 0.55;
            angleRadians = parseFloat((hour * 30) + (minute / 2)) / 180 * Math.PI;
            X = halfWidthClock + radius * Math.sin(angleRadians);
            Y = (halfWidthClock) - radius * Math.cos(angleRadians);

            ctx.lineTo(X, Y);
            ctx.stroke();

            ctx.strokeStyle = '#afafaf';
            ctx.lineCap = 'round';
            ctx.lineWidth = 7;
            ctx.beginPath();
            ctx.moveTo(halfWidthClock, halfWidthClock);
            ctx.lineTo(X, Y);
            ctx.stroke();

            // Минутная
            ctx.strokeStyle = 'rgba(0,0,0,0.77)';
            ctx.lineCap = 'round';
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(halfWidthClock, halfWidthClock);

            radius = halfWidthClock * 0.65;
            angleRadians = parseFloat((minute * 6) + (second / 10)) / 180 * Math.PI;
            X = halfWidthClock + radius * Math.sin(angleRadians);
            Y = (halfWidthClock) - radius * Math.cos(angleRadians);

            ctx.lineTo(X, Y);
            ctx.stroke();

            ctx.strokeStyle = '#afafaf';
            ctx.lineCap = 'round';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(halfWidthClock, halfWidthClock);
            ctx.lineTo(X, Y);
            ctx.stroke();

            // Секундная
            ctx.strokeStyle = 'rgba(0,0,0,0.77)';
            ctx.lineCap = 'round';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(halfWidthClock, halfWidthClock);

            radius = halfWidthClock * 0.75;
            angleRadians = parseFloat((6 * second)) / 180 * Math.PI;
            X = halfWidthClock + radius * Math.sin(angleRadians);
            Y = (halfWidthClock) - radius * Math.cos(angleRadians);

            ctx.lineTo(X, Y);
            ctx.stroke();

            ctx.strokeStyle = '#afafaf';
            ctx.lineCap = 'round';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(halfWidthClock, halfWidthClock);
            ctx.lineTo(X, Y);
            ctx.stroke();

            // Маленький круг в центре
            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.fillStyle = '#afafaf';
            ctx.strokeStyle = '#000000cc';
            ctx.arc(halfWidthClock, halfWidthClock, 8, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
        }
        requestAnimationFrame(drawClock);
    }

    function blank() {
        const clock = document.getElementById('clock');

        if (clock && clock.getContext('2d')) {
            let ctx = clock.getContext('2d');
            ctx.fillStyle = '#282828';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        }
    }

    requestAnimationFrame(drawClock);
}