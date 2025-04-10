uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;
uniform vec3 u_color5;
uniform vec3 u_color6;

uniform float u_intensity; // Интенсивность искажения
uniform float u_time; // Время для анимации
uniform vec2 u_resolution; // Разрешение экрана
uniform sampler2D u_texture; // Текстура для размытия

varying vec2 vUv; // Координаты текстуры
varying float vDisplacement; // Дисплейсмент для искажения


// Функция для создания эффекта свечения
vec3 addGlow(vec3 color, float factor) {
    return color + factor * vec3(1.0, 1.0, 1.0); // Добавляем белый цвет для имитации свечения
}

// Функция для применения простого размытия
vec3 applyBlur(vec2 uv) {
    vec3 sum = vec3(0.0);
    float total = 0.0;
    float blurSize = 1.0 / u_resolution.y; // Управление размером размытия

    // Цикл для обхода соседних пикселей
    for (float x = -2.0; x <= 2.0; x++) {
        for (float y = -2.0; y <= 2.0; y++) {
            vec2 offset = vec2(x, y) * blurSize; // Сдвиг для выборки соседних пикселей
            sum += texture(u_texture, uv + offset).rgb; // Правильная выборка из текстуры
            total += 1.0;
        }
    }

    return sum / total; // Возвращаем усреднённый цвет
}

void main() {
    // Расчёт искажения на основе координат и времени
    float distort = vDisplacement;

    // Цвета для градиента
    vec3 color1 = u_color1;
    vec3 color2 = u_color2;
    vec3 color3 = u_color3;
    vec3 color4 = u_color4;
    vec3 color5 = u_color5;
    vec3 color6 = u_color6;

    vec3 color;

    // Градиентный переход между цветами в зависимости от координаты по оси Y
    if (vUv.y < 0.2) {
        color = mix(color1, color2, vUv.y * 5.0);
    } else if (vUv.y < 0.4) {
        color = mix(color2, color3, (vUv.y - 0.2) * 5.0);
    } else if (vUv.y < 0.6) {
        color = mix(color3, color4, (vUv.y - 0.4) * 5.0);
    } else if (vUv.y < 0.8) {
        color = mix(color4, color5, (vUv.y - 0.6) * 5.0);
    } else {
        color = mix(color5, color1, (vUv.y - 0.9) * 5.0);
    }

    // Применяем искажение к цвету
    color += distort * .3;

    // Применяем эффект свечения
//    float glowFactor = 0.3;
//    color = addGlow(color, glowFactor);

    // Применяем размытие
    vec3 blurredColor = applyBlur(vUv);

    // Смешиваем размытие с исходным цветом для имитации эффекта размытия фона
    color = mix(color, blurredColor, 0.6-(u_intensity));

    gl_FragColor = vec4(color, 1.0); // Устанавливаем итоговый цвет пикселя
}
