<a href="https://disk.yandex.ru/d/brVJGswcmuE39g">All render video</a>

Platform support:
1. Windows 10, 11
2. Windows 8, 7 (without ansi, set use_ansi 0 on 8 line)
3. Linux

2d fractal:
1. Mandelbrot
![](render/pic0.png)
2. Tricorn
![](render/pic1.png)
3. Burning Ship
![](render/pic2.png)
4. Collatz (z = ((7 * z + 2) - cos(pi * z) * (5 * z + 2)) / 4)
![](render/pic3.png)
5. Collatz Mandelbrot (z = ((7 * z + 2) - exp(z) * (5 * z + 2)) / 4)
![](render/pic4.png)
6. Collatz v2 (z = ((7 * z + 2) - exp(pi * z * i) * (5 * z + 2)) / 4)
![](render/pic5.png)
6. z = e ^ z
![](render/pic6.png)
7. Phoenix
![](render/pic7.png)
8. Feather
![](render/pic8.png)
9. Newton
![](render/pic9.png)
10. Collatz Newton Mandelbrot (z = ((7 * z + 2) - exp(z) * (5 * z + 2)) / 4)
![](render/pic15.png)
11. Lyapunov
![](render/pic10.png)
12. Sin
![](render/pic14.png)
13. Gamma
![](render/pic16.png)
14. Zeta
![](render/pic17.png)
15. Zsinh
![](render/pic18.png)
16. Zeta t = 1/2 mandelbrot
![](render/zeta-mandelbrot-zoom.png)
17. Zsinh t = 1/2 mandelbrot
![](render/zsinh-mandelbrot-zoom.png)
18. Zcosh t = 1/2 mandelbrot
![](render/zcosh-mandelbrot-zoom.png)
19. Ztanh t = 1/2 mandelbrot
![](render/ztanh-mandelbrot-zoom.png)
20. Zeta(z) * Zeta(-z) mandelbrot
![](render/zetaz-mul-zeta-z-mandelbrot-zoom.png)
21. Zeta(iz) * Zeta(-iz)
![](render/pic22.png)
22. Zeta Burning Ship
![](render/pic21.png)


<br />
Visual similarity of exp and zeta with the same dynamics, comparing all functions, only exp and zeta behaved almost identically:<br />
https://asyncker.github.io/zeta-trigonometry/img/exp_pow.png <br />
https://asyncker.github.io/zeta-trigonometry/img/zeta_pow.png <br /> <br />

3d fractal:
1. Mandelbulb
![](render/pic11.png)

4d quaternion fractal:
1. Mandelbrot Quaternion
![](render/pic12.png)

4d bicomplex fractal:
1. Mandelbrot Bicomplex
![](render/pic13.png)

Compile to binary:
```bash
g++ main.cpp -O2 -march=native -ffast-math -o output
```

![](render/wave.png)

Hotkey:
1. 'V' - switch fractal
2. '0' - render fullhd
3. 'U' - switch julia/mandel
4. '4568' - move Julia (or rotate 3d)
5. 'WASD' - move
6. 'QE' - zoom
7. 'Ctrl + Scroll Mouse' - increase preview
8. 'N' - switch on 3d view
9. 'F' - divide 1/C
10. 'RT' - change power on -1 or +1
11. 'B' - switch on buddha-render (on ascii version)
12. '[]' - change power
13. 'I' - switch projection bicomplex
14. 'Y' - switch projection quaternion

Для всех фракталов из примеров всегда есть Julia.

Любую формулу в математике, можно конвертировать в фрактал.

Очень много фракаталов в алгебре построены на exp(z):
1. exp(z) + c = exp(z) + c
2. sinh(z) + c = (exp(z) - exp(-z)) / 2 + c
3. z ^ 2 + c = exp(2 * ln(z)) + c <br />

Collatz можно рассмотреть как динамическую систему вместо cos(pi * z) заменить на exp(z) увидем мандельброт даже при первой степени и если отобразим ньютон фрактал

Нужно больше внимание обратить на ещё более многозначные функции чем ln!

Нужно больше внимание сопряжённому и подобным функциям:
1. burning ship и tricorn имеют связь по бокой линии (при z^2)
2. zeta + burning ship крутой результат и есстественный узор
3. Сопряжённый можно применить до zeta(conj(z)) + c или после просчёта conj(zeta(z) + c)
4. Красиво выглядит кастомный mandelbulb 3d второй степени при burning ship эффекте

Динамика zeta(zeta(zeta(zeta(z)))) совпадает с exp(exp(exp(exp(z)))) легко проверить при малом eps сделав z^0.001, но при этом у zeta явная сложная структура
Визуальный пруф:<br />
https://asyncker.github.io/fractals/render/exp_pow.png <br />
https://asyncker.github.io/fractals/render/zeta_pow.png <br />

Основные и самые значимые это Exp, Zeta, Gamma, Netwon, Collatz, Lyapunov
