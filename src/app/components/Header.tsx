import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { UtensilsCrossed, Menu, X, Heart } from 'lucide-react';
import { cn } from './ui/utils';

export function Header() {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How It Works', href: '#how-it-works' },
    ];

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            const offset = 80; // Header height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
        setIsMobileMenuOpen(false);
    };

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
                isScrolled
                    ? 'bg-background/80 backdrop-blur-md py-3 shadow-sm border-border'
                    : 'bg-transparent py-5 border-transparent'
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <div
                    className="flex items-center gap-2 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="p-2 bg-green-600 rounded-lg group-hover:scale-110 transition-transform">
                        <UtensilsCrossed className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                        LeftOverLink
                    </span>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            onClick={(e) => scrollToSection(e, link.href)}
                            className="text-sm font-medium text-muted-foreground hover:text-green-600 transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-full font-bold"
                        onClick={() => navigate('/donate')}
                    >
                        <Heart className="w-4 h-4" />
                        Donate Now
                    </Button>
                    {localStorage.getItem('user') ? (
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
                            onClick={() => navigate('/signup')}
                        >
                            Get Started
                        </Button>
                    ) : (
                        <>
                            <Button
                                variant="ghost"
                                className="text-sm font-medium"
                                onClick={() => navigate('/login')}
                            >
                                Sign In
                            </Button>
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white rounded-full px-6"
                                onClick={() => navigate('/signup')}
                            >
                                Get Started
                            </Button>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-b overflow-hidden"
                    >
                        <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    onClick={(e) => scrollToSection(e, link.href)}
                                    className="text-lg font-medium py-2 border-b border-muted/20"
                                >
                                    {link.name}
                                </a>
                            ))}
                            <Button
                                variant="outline"
                                className="w-full justify-center text-green-600 border-green-600/20"
                                onClick={() => {
                                    navigate('/donate');
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <Heart className="w-4 h-4 mr-2" />
                                Donate Now
                            </Button>
                            <div className="flex flex-col gap-3 pt-2">
                                {localStorage.getItem('user') ? (
                                    <Button
                                        className="w-full justify-center bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => {
                                            navigate('/signup');
                                            setIsMobileMenuOpen(false);
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-center"
                                            onClick={() => {
                                                navigate('/login');
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            Sign In
                                        </Button>
                                        <Button
                                            className="w-full justify-center bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() => {
                                                navigate('/signup');
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            Get Started
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
