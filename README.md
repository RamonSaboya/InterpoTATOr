# InterpoTATOr: Textura por interpolação linear

A aplicação pode ser acessada em: [InterpoTATOr](https://ramonsaboya.github.io/InterpoTATOr/)

## Parte Geral
Implementar o método de visualização de objetos triangulados, através do algoritmo de conversão por varredura, com métodos de interpolação de Phong, com a visibilidade garantida pelo algoritmo do “z-buffer”.

## Parte Específica
Produzir uma textura por meio de interpolação linear. 

## Descrição
### Entrada
O usuário, através de arquivos-texto, entra com:
- Dados do objeto, no formato:
    ```
    p t
    x y z (p linhas neste formato)
    p1 p2 p3 (t linhas neste formato)
    ```
    - *p* quantidade de pontos;
    - *t* quantidade de triângulos;
    - *x*, *y*, *z* coordenadas, como números de ponto flutuante;
    - *p1*, *p2*, *p3* índices de pontos (vértices dos triângulos), como números inteiros.

- Atributos da câmera virtual, no formato:
    ```
    x y z
    nx ny nz
    vx vy vz
    d hx hy
    ```
    - *x*, *y*, *z* coordenadas da câmera virtual no mundo, como números de ponto flutuante;
    - *nx*, *ny*, *nz* vetor N de direcionamento da câmera, como números de ponto flutuante;
    - *vx*, *vy*, *vz* vetor V de rotação da câmera, como números de ponto flutuante;
    - *d* escala da câmera virtual, como número de ponto flutuante positivo;
    - *hx* tamanho do eixo X, como número de ponto flutuante positivo;
    - *hy* tamanho do eixo y, como número de ponto flutuante positivo.

- Atributos da cena (iluminação), no formato:
    ```
    x y z
    ka
    Iax Iay Iaz
    kd
    Idx Idy Idz
    ks
    Isx Isy Isz
    n
    axis
    Id2x Id2y Id2z
    ```
    - *x*, *y*, *z* coordenadas da fonte de luz no mundo, como números de ponto flutuante;
    - *ka* constante do componente ambiental da luz, como número de ponto flutuante entre 0 e 1;
    - *Iax*, *Iay*, *Iaz* cor do componente ambiental da luz, como números inteiros entre 0 e 255 (RGB);
    - *kd* constante do componente difuso da luz, como número de ponto flutuante entre 0 e 1;
    - *Idx*, *Idy*, *Idz* cor do componente difuso da luz, como números de ponto flutuante entre 0 e 1 (Intensidade);
    - *ks* constante do componente especular da luz, como número de ponto flutuante entre 0 e 1;
    - *Isx*, *Isy*, *Isz* cor do componente especular da luz, como números inteiros entre 0 e 255 (RGB);
    - *n* constante de rugosidade, como número natural positivo;
    - *axis* eixo da interpolação linear, com valores:
        - *0* para eixo OX;
        - *1* para eixo OY;
        - *2* para eixo OZ;
    - *Id2x*, *Id2y*, *Id2z* cor do segundo componente difuso da luz, como números de ponto flutuante entre 0 e 1 (Intensidade);
    Os componentes *axis* e *Id2* são opcionais e co-dependentes. Caso não especificados, o programa não irá realizar interpolação linear para formar o componente difuso do pixel.

### Sistema
O sistema prepara a câmera, ortogonalizando V, gerando U e depois os normalizando. Faz a mudança de coordenadas para o sistema de vista de todos os vértices do objeto e da posição da fonte de luz PL, gera as normais dos triângulos e soma as mesmas com a normal de cada uma de suas vértices (iniciadas em vetores zerados). 

Para cada triângulo, calculam-se as projeções dos seus vértices e inicia-se assim, a sua conversão por varredura utilizando o algoritmo de Bresenham. Para cada pixel (x, yscan), calculam-se suas coordenadas baricêntricas com relação aos vértices projetados e multiplicam-se essas coordenadas pelos correspondentes vértices do triângulo 3D original para se obter uma aproximação para o ponto 3D original, correspondente ao pixel atual. Após uma consulta ao z-buffer, se for o caso, calcula-se uma aproximação para a normal do ponto utilizando-se mesmas coordenadas baricêntricas multiplicadas pelas normais dos respectivos vértices originais. Calculam-se também os demais vetores (L, V e R) e os substitui na equação do modelo de iluminação de Phong produzindo a cor do pixel atual.

Se for para usar a textura por interpolação linear, deve-se fazer um mapeamento do “bounding box” (BB) do objeto (no eixo escolhido). Com as coordenadas do ponto 3D (x,y,z), pode-se encontrar sua posição relativa no BB, com respeito ao eixo escolhido para o usuário, achando o fator *f* da interpolação linear: 
- Eixo OX: f = (x – Xmin) / (Xmax – Xmin);
- Eixo OY: f = (y – Ymin) / (Ymax – Ymin);
- Eixo OZ: f = (z – Zmin) / (Zmax – Zmin).

Nos quais o min e max são coordenadas mapeadas pela BB. Então: Id = ((1 – f) * Id) + (f * Id2).

## Autores
- [João Filipe Moura](https://github.com/jfmrm)
- [Luiz Henrique Oliveira](https://github.com/lhsgo)
- [Ramon de Saboya](https://github.com/RamonSaboya)



###### Curiosidade
Agradecimento especial à [Luiz Henrique Caúla](https://github.com/hcaula) (TATO), pela inspiração no nome da aplicação.
