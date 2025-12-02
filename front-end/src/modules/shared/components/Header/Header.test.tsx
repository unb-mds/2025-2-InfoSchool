import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';

// Mock do next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
    usePathname: () => '/',
}));

// Mock do ThemeProvider para evitar erros de contexto
jest.mock('../ThemeProvider/ThemeProvider', () => ({
    useTheme: () => ({
        theme: 'light',
        toggleTheme: jest.fn(),
    }),
    ThemeProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('Header Component', () => {
    it('deve renderizar o logo e o título InfoSchool', () => {
        render(<Header />);

        const logo = screen.getByAltText('InfoSchool Logo');
        const title = screen.getByText('InfoSchool');

        expect(logo).toBeInTheDocument();
        expect(title).toBeInTheDocument();
    });

    it('deve renderizar os links de navegação', () => {
        render(<Header />);

        const sobreNosLink = screen.getByText('Sobre nós');
        const usarIALink = screen.getByText('Usar IA');

        expect(sobreNosLink).toBeInTheDocument();
        expect(usarIALink).toBeInTheDocument();
    });

    it('deve renderizar o input de busca na home page', () => {
        render(<Header />);

        const searchInput = screen.getByPlaceholderText('Digite o nome da escola');
        expect(searchInput).toBeInTheDocument();
    });

    it('deve atualizar o valor do input de busca ao digitar', () => {
        render(<Header />);

        const searchInput = screen.getByPlaceholderText('Digite o nome da escola') as HTMLInputElement;
        fireEvent.change(searchInput, { target: { value: 'Escola Teste' } });

        expect(searchInput.value).toBe('Escola Teste');
    });
});
