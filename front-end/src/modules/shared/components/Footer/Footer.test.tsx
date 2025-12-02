import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer Component', () => {
    it('deve renderizar as informações de contato', () => {
        render(<Footer />);

        expect(screen.getByText('contato@infoschool.br')).toBeInTheDocument();
        expect(screen.getByText('(61) 99603-2741')).toBeInTheDocument();
        expect(screen.getByText('Universidade de Brasília Campus Gama - DF')).toBeInTheDocument();
    });

    it('deve renderizar o ano atual no copyright', () => {
        render(<Footer />);

        const currentYear = new Date().getFullYear();
        expect(screen.getByText((content) => content.includes(currentYear.toString()))).toBeInTheDocument();
        expect(screen.getByText((content) => content.includes('InfoSchool - Censo Escolar'))).toBeInTheDocument();
    });
});
