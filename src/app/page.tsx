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
  Car, Shield, Zap, BarChart3, Users, Check, Menu,
  X, ArrowRight, Star, Globe, Target, DollarSign, Play, Sparkles
} from 'lucide-react';
import { registerPublicStore } from '@/app/actions/store';

export default function LandingPage() {
  const router = useRouter();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Estados de Formulário e Loading
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);

  // LÓGICA DE LOGIN REAL
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      toast.error('Email ou senha incorretos.');
      setIsLoading(false);
    } else {
      toast.success('Login aprovado! Entrando no sistema...');
      setIsLoginOpen(false);
      router.push('/dashboard'); 
    }
  };

  // LÓGICA DE CADASTRO E LOGIN AUTOMÁTICO (PLG)
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSignupLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const signupEmail = formData.get("ownerEmail") as string;
    const signupPassword = formData.get("password") as string;

    // 1. Chama a Server Action para criar Loja e Usuário no banco
    const result = await registerPublicStore(formData);

    if (result.error) {
      toast.error(result.error);
      setIsSignupLoading(false);
      return;
    }

    toast.success('Cadastro realizado com sucesso! Preparando seu ambiente...');
    
    // 2. Faz o login automaticamente com os dados recém criados
    const loginResult = await signIn("credentials", {
      email: signupEmail,
      password: signupPassword,
      redirect: false,
    });

    if (!loginResult?.error) {
      router.push('/dashboard');
    } else {
      toast.info('Conta criada! Por favor, faça o login.');
      setIsSignupOpen(false);
      setIsLoginOpen(true);
      setIsSignupLoading(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const onViewStorefront = (slug: string) => {
    // Redireciona para uma vitrine de demonstração genérica
    window.open(`/loja/${slug}`, '_blank');
  };

  // --- DADOS DA LANDING PAGE ---
  const features = [
    { icon: Target, title: 'Atribuição Offline Precisa', description: 'Rastreie cada lead do clique até a visita presencial com QR Codes únicos', color: 'from-blue-500 to-blue-600' },
    { icon: Globe, title: 'Vitrine Whitelabel', description: 'Landing page personalizada para sua loja com catálogo completo', color: 'from-purple-500 to-purple-600' },
    { icon: BarChart3, title: 'ROI Comprovado', description: 'Relatórios que mostram exatamente qual anúncio trouxe cada cliente', color: 'from-green-500 to-green-600' },
    { icon: Zap, title: 'Central de Tráfego', description: 'Gerencie campanhas Meta Ads e Google Ads em um único painel', color: 'from-yellow-500 to-orange-500' },
    { icon: Shield, title: 'Anti-fraude Avançado', description: 'Validação por geolocalização e foto para garantir visitas reais', color: 'from-red-500 to-pink-600' },
    { icon: Users, title: 'Gestão de Equipe', description: 'Controle de vendedores com permissões e atribuição de leads', color: 'from-indigo-500 to-indigo-600' }
  ];

  const plans = [
    { name: 'Starter', price: 'R$ 97', period: '/mês', description: 'Ideal para lojas pequenas começando', features: ['Vitrine profissional', 'Até 50 leads/mês', 'CRM básico', '1 usuário vendedor', 'Suporte por email'], highlighted: false },
    { name: 'Professional', price: 'R$ 197', period: '/mês', description: 'Para lojas em crescimento', features: ['Tudo do Starter', 'Leads ilimitados', 'Central de tráfego', 'Até 5 vendedores', 'Relatórios avançados', 'Suporte prioritário', 'WhatsApp Bot'], highlighted: true },
    { name: 'Enterprise', price: 'Personalizado', period: '', description: 'Para redes e grandes lojas', features: ['Tudo do Professional', 'Multi-lojas', 'API dedicada', 'White-label completo', 'Usuários ilimitados', 'Gerente de conta', 'SLA garantido'], highlighted: false }
  ];

  const testimonials = [
    { name: 'Carlos Silva', role: 'Proprietário - AutoLux Premium', content: 'Antes eu gastava R$5k/mês em anúncios e não sabia se funcionava. Agora sei exatamente quantos clientes vieram e quanto custou cada um.', rating: 5, avatar: 'CS' },
    { name: 'Marina Costa', role: 'Gerente - Carros VIP', content: 'A funcionalidade de QR Code revolucionou nossa operação. Conseguimos provar para o dono que nosso trabalho traz resultados.', rating: 5, avatar: 'MC' },
    { name: 'Roberto Almeida', role: 'Diretor - Rede AutoMax', content: 'Implementamos em 8 lojas. ROI de 4.2x no primeiro mês. O melhor investimento que fizemos.', rating: 5, avatar: 'RA' }
  ];

  const faqs = [
    { question: 'Como funciona a atribuição offline?', answer: 'Cada lead recebe um QR Code único. Quando o cliente visita a loja, o vendedor escaneia o código no app. O sistema valida a geolocalização e registra a visita, gerando cobrança automática.' },
    { question: 'Qual a diferença para WebMotors/OLX?', answer: 'Em marketplaces, você compete com todas as lojas e perde o controle do lead. No LeadTrack, você tem sua própria vitrine, constrói marca própria e rastreia cada lead do início ao fim.' },
    { question: 'Como é a cobrança?', answer: 'Mensalidade base fixa + valor por lead presencial validado (R$15-25). Você só paga quando o cliente realmente visita sua loja.' },
    { question: 'Preciso saber de tecnologia?', answer: 'Não! O sistema é intuitivo e oferecemos onboarding completo. Em 1 dia sua loja está no ar.' },
    { question: 'Posso cancelar quando quiser?', answer: 'Sim, sem multas ou burocracia. Mas 98% dos nossos clientes renovam após o primeiro mês.' },
    { question: 'Vocês gerenciam os anúncios?', answer: 'Sim! Temos pacotes com gestão completa de Meta Ads e Google Ads inclusa.' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                <Car className="size-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  LeadTrack
                </span>
                <p className="text-xs text-gray-500 -mt-1">Atribuição Offline</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {['recursos', 'precos', 'depoimentos', 'faq'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium"
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
              <button
                onClick={() => onViewStorefront('autolux')}
                className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all font-medium flex items-center gap-2"
              >
                <Play className="size-4" />
                Demo
              </button>
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Button variant="ghost" onClick={() => setIsLoginOpen(true)} className="font-semibold">
                Entrar
              </Button>
              <Button onClick={() => setIsSignupOpen(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 font-semibold text-white">
                Começar Grátis
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in bg-white">
              <nav className="flex flex-col gap-2">
                {['recursos', 'precos', 'depoimentos', 'faq'].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className="text-left px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                ))}
                <button
                  onClick={() => onViewStorefront('autolux')}
                  className="text-left px-4 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                >
                  Ver Demo
                </button>
                <div className="flex flex-col gap-2 mt-2 px-2">
                  <Button variant="outline" onClick={() => setIsLoginOpen(true)} className="justify-center w-full">
                    Entrar
                  </Button>
                  <Button onClick={() => setIsSignupOpen(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-full">
                    Começar Grátis
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
        {/* Background original preservado */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40"></div>

        <div className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-xs md:text-sm font-semibold mb-6 md:mb-8 shadow-lg shadow-blue-500/30 animate-fade-in">
              <Sparkles className="size-3 md:size-4" />
              <span className="whitespace-nowrap">ROI médio de 4.2x</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-4 md:mb-6 leading-tight animate-fade-in px-4">
              Transforme Cliques em{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Visitas Presenciais
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 md:mb-10 leading-relaxed max-w-3xl mx-auto animate-fade-in px-4">
              A única plataforma que <strong>prova exatamente</strong> qual lead visitou sua loja de veículos.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-12 md:mb-16 animate-fade-in px-4">
              <Button size="lg" onClick={() => setIsSignupOpen(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl shadow-blue-500/30 text-white text-base md:text-lg px-6 md:px-8 h-12 md:h-14 w-full sm:w-auto">
                <Sparkles className="size-4 md:size-5 mr-2" />
                Começar Teste Grátis
                <ArrowRight className="size-4 md:size-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => onViewStorefront('autolux')} className="border-2 text-base md:text-lg px-6 md:px-8 h-12 md:h-14 hover:bg-gray-50 text-gray-700 w-full sm:w-auto">
                <Play className="size-4 md:size-5 mr-2" />
                Ver Demonstração
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-8 max-w-3xl mx-auto animate-fade-in px-4">
              {[
                { value: '98%', label: 'Precisão' },
                { value: '4.2x', label: 'ROI Médio' },
                { value: '37%', label: 'Taxa Visita' }
              ].map((stat, idx) => (
                <div key={idx} className="bg-white/60 backdrop-blur-sm rounded-xl md:rounded-2xl p-3 md:p-6 shadow-lg border border-white">
                  <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-1 md:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="hidden md:block absolute top-1/4 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="hidden md:block absolute bottom-1/4 left-0 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
      </section>

      {/* Features */}
      <section id="recursos" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tudo que você precisa para <span className="text-blue-600">vender mais</span>
            </h2>
            <p className="text-xl text-gray-600">
              Ferramentas profissionais para digitalizar seu estoque e provar o ROI dos anúncios
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-blue-200 hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                <CardHeader>
                  <div className={`bg-gradient-to-br ${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className="size-7 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-3">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="precos" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Planos que <span className="text-blue-600">crescem com você</span>
            </h2>
            <p className="text-xl text-gray-600">
              Sem surpresas. Cancele quando quiser. Comece grátis.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${plan.highlighted ? 'border-4 border-blue-500 shadow-2xl shadow-blue-500/20 scale-105' : 'border-2 hover:border-blue-200'} transition-all duration-300 overflow-hidden bg-white`}
              >
                {plan.highlighted && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 text-sm font-bold transform rotate-45 translate-x-8 translate-y-4">
                    POPULAR
                  </div>
                )}
                <CardHeader className="pb-8">
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 ml-2">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="bg-green-100 rounded-full p-1 mt-0.5">
                          <Check className="size-4 text-green-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full h-12 text-base font-semibold ${
                      plan.highlighted 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 text-white' 
                        : ''
                    }`}
                    variant={plan.highlighted ? 'default' : 'outline'}
                    onClick={() => setIsSignupOpen(true)}
                  >
                    {plan.price === 'Personalizado' ? 'Falar com Vendas' : 'Começar Agora'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-full px-6 py-3 inline-flex items-center gap-2">
              <DollarSign className="size-4" />
              Cobrança adicional: R$ 15-25 por lead presencial validado
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="depoimentos" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              O que <span className="text-blue-600">nossos clientes</span> dizem
            </h2>
            <p className="text-xl text-gray-600">
              Resultados reais de lojistas que transformaram seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-2 hover:border-blue-200 hover:shadow-xl transition-all">
                <CardContent className="pt-8">
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic leading-relaxed text-lg">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Perguntas <span className="text-blue-600">Frequentes</span>
            </h2>
            <p className="text-xl text-gray-600">
              Tire suas dúvidas sobre o LeadTrack
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="bg-white px-6 rounded-xl border-2 hover:border-blue-200 transition-colors">
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="font-bold text-gray-900 text-lg pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-6 text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="container mx-auto px-4 text-center relative">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Pronto para aumentar suas vendas?
          </h2>
          <p className="text-2xl mb-10 opacity-90 max-w-2xl mx-auto">
            Teste grátis por 14 dias. Sem cartão de crédito. Cancele quando quiser.
          </p>
          <Button size="lg" variant="secondary" onClick={() => setIsSignupOpen(true)} className="bg-white text-blue-600 hover:bg-gray-100 shadow-2xl text-lg px-10 h-16 font-bold">
            <Sparkles className="size-6 mr-2" />
            Começar Agora Grátis
            <ArrowRight className="size-6 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl">
                  <Car className="size-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">LeadTrack</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Atribuição offline para lojas de veículos. Transforme cliques em visitas comprovadas.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Produto</h4>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection('recursos')} className="hover:text-white transition-colors">Recursos</button></li>
                <li><button onClick={() => scrollToSection('precos')} className="hover:text-white transition-colors">Preços</button></li>
                <li><button onClick={() => onViewStorefront('autolux')} className="hover:text-white transition-colors">Demo</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Empresa</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Legal</h4>
              <ul className="space-y-3">
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">© 2024 LeadTrack. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* LOGIN DIALOG (Limpo, sem senhas de teste) */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Entrar na sua conta</DialogTitle>
            <DialogDescription>Entre com suas credenciais para acessar o dashboard</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-5 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-base">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12"
                required
              />
            </div>

            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold text-white" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>

            <div className="text-center">
              <button type="button" className="text-sm text-blue-600 hover:underline font-medium">
                Esqueceu a senha?
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* SIGNUP DIALOG (Funcional com Action) */}
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Criar sua conta</DialogTitle>
            <DialogDescription>Comece seu teste grátis de 14 dias agora</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignup} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Nome completo</Label>
              <Input name="ownerName" id="signup-name" placeholder="João Silva" className="h-12" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-store">Nome da loja</Label>
              <Input name="storeName" id="signup-store" placeholder="AutoLux Premium" className="h-12" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input name="ownerEmail" id="signup-email" type="email" placeholder="joao@minhaloja.com" className="h-12" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Senha</Label>
              <Input name="password" id="signup-password" type="password" placeholder="••••••••" className="h-12" required />
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-900 flex items-center gap-2">
                <Sparkles className="size-5" />
                <span><strong>14 dias grátis</strong> - Sem cartão de crédito</span>
              </p>
            </div>

            <Button type="submit" className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold text-white" disabled={isSignupLoading}>
              {isSignupLoading ? 'Preparando conta...' : 'Criar Conta Grátis'}
            </Button>

            <p className="text-xs text-center text-gray-600">
              Ao criar uma conta, você concorda com nossos <a href="#" className="text-blue-600 hover:underline">Termos de Uso</a>
            </p>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}