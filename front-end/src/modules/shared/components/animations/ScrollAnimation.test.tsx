import { render, screen, act } from '@testing-library/react';
import { ScrollAnimation } from './ScrollAnimation';

describe('ScrollAnimation Component', () => {
    beforeEach(() => {
        // Mock do IntersectionObserver
        const mockIntersectionObserver = jest.fn();
        mockIntersectionObserver.mockReturnValue({
            observe: () => null,
            unobserve: () => null,
            disconnect: () => null
        });
        window.IntersectionObserver = mockIntersectionObserver;
    });

    it('deve renderizar os filhos', () => {
        render(
            <ScrollAnimation>
                <div>Animated Content</div>
            </ScrollAnimation>
        );
        expect(screen.getByText('Animated Content')).toBeInTheDocument();
    });

    it('deve iniciar invisível e aplicar estilos de animação', () => {
        const { container } = render(
            <ScrollAnimation direction="up">
                <div>Content</div>
            </ScrollAnimation>
        );

        const animatedDiv = container.firstChild as HTMLElement;

        // Verifica estilos iniciais (não visível)
        expect(animatedDiv).toHaveStyle({
            opacity: '0',
            transform: 'translateY(30px)'
        });
    });

    it('deve aplicar diferentes direções de animação', () => {
        const { container, rerender } = render(
            <ScrollAnimation direction="left">
                <div>Content</div>
            </ScrollAnimation>
        );
        expect(container.firstChild).toHaveStyle({ transform: 'translateX(30px)' });

        rerender(
            <ScrollAnimation direction="right">
                <div>Content</div>
            </ScrollAnimation>
        );
        expect(container.firstChild).toHaveStyle({ transform: 'translateX(-30px)' });

        rerender(
            <ScrollAnimation direction="down">
                <div>Content</div>
            </ScrollAnimation>
        );
        expect(container.firstChild).toHaveStyle({ transform: 'translateY(-30px)' });
    });

    it('deve tornar-se visível quando o IntersectionObserver detectar interseção', async () => {
        jest.useFakeTimers();

        let observeCallback: (entries: any[]) => void = () => { };

        window.IntersectionObserver = jest.fn((callback) => {
            observeCallback = callback;
            return {
                observe: jest.fn(),
                unobserve: jest.fn(),
                disconnect: jest.fn(),
            };
        }) as any;

        const { container } = render(
            <ScrollAnimation delay={0}>
                <div>Content</div>
            </ScrollAnimation>
        );

        // Simula a interseção
        act(() => {
            observeCallback([{ isIntersecting: true }]);
        });

        // Avança o timer
        act(() => {
            jest.runAllTimers();
        });

        const animatedDiv = container.firstChild as HTMLElement;

        expect(animatedDiv).toHaveStyle({
            opacity: '1',
            transform: 'translateY(0) translateX(0)'
        });
    });
});
