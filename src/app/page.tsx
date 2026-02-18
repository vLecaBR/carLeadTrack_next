"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { 
  Car, TrendingUp, Shield, Zap, BarChart3, Users, Check, Menu, 
  X, ArrowRight, Star, Globe, Target, DollarSign, Play, Sparkles 
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Estados do Formulário de Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // LOGICA REAL DE LOGIN INTEGRADA AO NEXT-AUTH
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false, // Mantemos false para não recarregar a página e podermos fechar o modal
    });

    if (result?.error) {
      toast.error('Email ou senha incorretos. Tente novamente.');
      setIsLoading(false);
    } else {
      toast.success('Login aprovado! Entrando no sistema...');
      setIsLoginOpen(false);
      // Manda o usuário pro painel
      router.push('/dashboard'); 
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Cadastro realizado com sucesso! Em breve ativaremos sua conta.');
    setIsSignupOpen(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const onViewStorefront = () => {
    toast.info("A vitrine pública das lojas será desenvolvida em breve!");
  };

  // --- DADOS ESTÁTICOS DA LANDING PAGE ---
  const features = [
    { icon: Target, title: 'Atribuição Offline Precisa', description: 'Rastreie cada lead do clique até a visita presencial com QR Codes únicos', color: 'from-blue-500 to-blue-600' },
    { icon: Globe, title: 'Vitrine Whitelabel', description: 'Landing page personalizada para sua loja com catálogo completo', color: 'from-purple-500 to-purple-600' },
    { icon: BarChart3, title: 'ROI Comprovado', description: 'Relatórios que mostram exatamente qual anúncio trouxe cada cliente', color: 'from-green-500 to-green-600' },
    { icon: Zap, title: 'Central de Tráfego', description: 'Gerencie campanhas Meta Ads e Google Ads em um único painel', color: 'from-yellow-500 to-orange-500' },
    { icon: Shield, title: 'Anti-fraude Avançado', description: 'Validação por geolocalização e foto para garantir visitas reais', color: 'from-red-500 to-pink-600' },
    { icon: Users, title: 'Gestão de Equipe', description: 'Controle de vendedores com permissões e atribuição de leads', color: 'from-indigo-500 to-indigo-600' }
  ];

  const plans = [
    { name: 'Starter', price: 'R$ 97', period: '/mês', description: 'Ideal para lojas pequenas', features: ['Vitrine profissional', 'Até 50 leads/mês', 'CRM básico', '1 vendedor'], highlighted: false },
    { name: 'Professional', price: 'R$ 197', period: '/mês', description: 'Para lojas em crescimento', features: ['Tudo do Starter', 'Leads ilimitados', 'Até 5 vendedores', 'Relatórios avançados'], highlighted: true },
    { name: 'Enterprise', price: 'Personalizado', period: '', description: 'Redes e grandes lojas', features: ['Multi-lojas', 'API dedicada', 'White-label completo', 'SLA garantido'], highlighted: false }
  ];

  const testimonials = [
    { name: 'Carlos Silva', role: 'AutoLux Premium', content: 'Agora sei exatamente quantos clientes vieram e quanto custou cada um.', rating: 5, avatar: 'CS' },
    { name: 'Marina Costa', role: 'Carros VIP', content: 'Conseguimos provar para o dono que nosso trabalho traz resultados.', rating: 5, avatar: 'MC' },
    { name: 'Roberto Almeida', role: 'Rede AutoMax', content: 'ROI de 4.2x no primeiro mês. O melhor investimento que fizemos.', rating: 5, avatar: 'RA' }
  ];

  const faqs = [
    { question: 'Como funciona a atribuição offline?', answer: 'Cada lead recebe um QR Code único. Quando o cliente visita a loja, o vendedor escaneia o código.' },
    { question: 'Qual a diferença para os marketplaces?', answer: 'Você tem sua própria vitrine, constrói marca própria e rastreia cada lead do início ao fim.' },
    { question: 'Como é a cobrança?', answer: 'Mensalidade fixa + valor por lead presencial validado. Você só paga pelo que funciona.' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                <Car className="size-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  MVPCarLead
                </span>
                <p className="text-xs text-gray-500 -mt-1">Atribuição Offline</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {['recursos', 'precos', 'depoimentos', 'faq'].map((section) => (
                <button key={section} onClick={() => scrollToSection(section)} className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium">
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
              <button onClick={onViewStorefront} className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium flex items-center gap-2">
                <Play className="size-4" /> Demo
              </button>
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" onClick={() => setIsLoginOpen(true)} className="font-semibold">
                Entrar
              </Button>
              <Button onClick={() => setIsSignupOpen(true)} className="bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 font-semibold text-white">
                Começar Grátis
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Transforme Cliques em <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Visitas Presenciais</span>
            </h1>
            <p className="text-lg md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
              A única plataforma que <strong>prova exatamente</strong> qual lead visitou sua loja de veículos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" onClick={() => setIsSignupOpen(true)} className="bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 h-14 px-8 text-lg">
                <Sparkles className="size-5 mr-2" /> Começar Teste Grátis
              </Button>
              <Button size="lg" variant="outline" onClick={onViewStorefront} className="border-2 h-14 px-8 text-lg hover:bg-gray-50">
                <Play className="size-5 mr-2" /> Ver Demonstração
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ... (O restante da sua Landing Page continua intacto: Recursos, Preços, Depoimentos e FAQ) ... */}

      {/* MODAL DE LOGIN (AGORA 100% REAL) */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Entrar no Sistema</DialogTitle>
            <DialogDescription>Entre com suas credenciais para acessar o painel</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 h-12" disabled={isLoading}>
              {isLoading ? 'Autenticando...' : 'Entrar na Plataforma'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Signup (Mantido Estético para o MVP) */}
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Criar sua conta</DialogTitle>
            <DialogDescription>Comece seu teste grátis de 14 dias agora</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignup} className="space-y-4">
            <Input placeholder="Nome completo" required />
            <Input placeholder="Nome da Loja" required />
            <Input type="email" placeholder="Email" required />
            <Input type="password" placeholder="Senha" required />
            <Button type="submit" className="w-full bg-blue-600 text-white h-12">Criar Conta Grátis</Button>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}