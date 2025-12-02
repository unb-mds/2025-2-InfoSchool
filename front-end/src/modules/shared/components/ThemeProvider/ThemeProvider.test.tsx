import { render, screen, fireEvent, act } from '@testing-library/react';
import { ThemeProvider, useTheme } from './ThemeProvider';

// Componente auxiliar para testar o hook useTheme
const TestComponent = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div>
            <span data-testid="theme-value">{theme}</span>
            <button onClick={toggleTheme}>Toggle Theme</button>
        </div>
    );
};

describe('ThemeProvider Component', () => {
    beforeEach(() => {
        // Limpar localStorage e classes do documento antes de cada teste
        localStorage.clear();
        document.documentElement.className = '';
        document.documentElement.removeAttribute('data-theme');
    });

    it('deve renderizar os filhos corretamente', () => {
        render(
            <ThemeProvider>
                <div>Child Component</div>
            </ThemeProvider>
        );
        expect(screen.getByText('Child Component')).toBeInTheDocument();
    });

    it('deve fornecer o tema padrão (dark)', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );
        expect(screen.getByTestId('theme-value')).toHaveTextContent('dark');
    });

    it('deve alternar o tema ao chamar toggleTheme', () => {
        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        const button = screen.getByText('Toggle Theme');
        const themeValue = screen.getByTestId('theme-value');

        // Inicialmente dark
        expect(themeValue).toHaveTextContent('dark');

        // Mudar para light
        fireEvent.click(button);
        expect(themeValue).toHaveTextContent('light');
        expect(localStorage.getItem('theme')).toBe('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');

        // Mudar de volta para dark
        fireEvent.click(button);
        expect(themeValue).toHaveTextContent('dark');
        expect(localStorage.getItem('theme')).toBe('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('deve carregar o tema salvo no localStorage', () => {
        localStorage.setItem('theme', 'light');

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        );

        expect(screen.getByTestId('theme-value')).toHaveTextContent('light');
    });
});
