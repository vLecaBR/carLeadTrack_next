"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Car, Phone, MapPin, Search, ArrowLeft, MessageCircle, Calendar, Gauge, 
  DollarSign, Filter, X, Check, Zap, Shield, Award, Clock, Fuel, Cog, 
  Heart, Share2, Star, Users, TrendingUp, ThumbsUp, Wrench, FileText, CreditCard
} from 'lucide-react';
import { toast } from 'sonner';

// Mock Action temporária até criarmos a real do Lead
const mockCreatePublicLead = async (storeId: string, formData: FormData) => {
  return new Promise<{ error?: string, qrCode?: string }>((resolve) => 
    setTimeout(() => resolve({ qrCode: "LEAD-" + Math.random().toString(36).substring(2, 8).toUpperCase() }), 1000)
  );
};

interface StorefrontPublicProps {
  store: any;
  vehicles: any[];
  onBackToDashboard?: () => void;
  onBackToLanding?: () => void;
}

export function StorefrontPublic({ store, vehicles, onBackToDashboard, onBackToLanding }: StorefrontPublicProps) {
  // Pega apenas os carros disponíveis
  const allVehicles = vehicles.filter(v => v.isAvailable);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Filtros ajustados para não esconder nada na abertura
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [yearRange, setYearRange] = useState<[number, number]>([1920, new Date().getFullYear()]);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  
  // Ordenação padrão alterada para 'Menor Preço'
  const [sortBy, setSortBy] = useState<string>('price-asc');

  const primaryColor = store?.primaryColor || '#3b82f6';

  // Aplicar filtros
  let filteredVehicles = allVehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPrice = vehicle.price >= priceRange[0] && vehicle.price <= priceRange[1];
    const matchesYear = vehicle.year >= yearRange[0] && vehicle.year <= yearRange[1];
    const matchesBrand = selectedBrand === 'all' || vehicle.brand === selectedBrand;

    return matchesSearch && matchesPrice && matchesYear && matchesBrand;
  });

  // Ordenar
  if (sortBy === 'price-asc') {
    filteredVehicles = [...filteredVehicles].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filteredVehicles = [...filteredVehicles].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'year-desc') {
    filteredVehicles = [...filteredVehicles].sort((a, b) => b.year - a.year);
  } else if (sortBy === 'km-asc') {
    filteredVehicles = [...filteredVehicles].sort((a, b) => a.km - b.km);
  }

  const uniqueBrands = Array.from(new Set(allVehicles.map(v => v.brand)));

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const result = await mockCreatePublicLead(store.id, formData);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        <div>
          <p className="font-semibold">Lead registrado com sucesso!</p>
          <p className="text-sm mt-1">Seu código de visita: <span className="font-mono font-bold text-lg text-blue-600">{result.qrCode}</span></p>
          <p className="text-xs mt-1 text-gray-500">Mostre este código na loja para atendimento prioritário!</p>
        </div>,
        { duration: 10000 }
      );
      setIsContactDialogOpen(false);
    }
    setIsSubmitting(false);
  };

  const resetFilters = () => {
    setPriceRange([0, 500000]);
    setYearRange([1920, new Date().getFullYear()]);
    setSelectedBrand('all');
    setSortBy('price-asc'); // Mantém o menor preço ao resetar
  };

  // Verifica se há algum filtro ativado pelo usuário para mostrar a tag "Ativos"
  const hasActiveFilters = 
    selectedBrand !== 'all' || 
    priceRange[0] > 0 || 
    priceRange[1] < 500000 || 
    yearRange[0] > 1920 || 
    yearRange[1] < new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header 
        className="text-white shadow-xl relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)` }}
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
        
        <div className="container mx-auto px-4 py-8 relative">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-4">
              {(onBackToDashboard || onBackToLanding) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={onBackToDashboard || onBackToLanding}
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Voltar
                </Button>
              )}
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl border border-white/30">
                  <Car className="size-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{store.name}</h1>
                  <p className="text-sm opacity-90 mt-1">Veículos Seminovos e Usados de Qualidade</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <a href={`tel:${store.phone}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Phone className="size-5" />
                <span className="font-semibold">{store.phone || "Telefone não cadastrado"}</span>
              </a>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <MapPin className="size-5" />
                <span className="hidden md:inline">{store.address || "Endereço não cadastrado"}</span>
              </div>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="text-3xl font-bold">{allVehicles.length}+</div>
              <div className="text-sm opacity-90">Veículos Disponíveis</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="text-3xl font-bold">15+</div>
              <div className="text-sm opacity-90">Anos de Mercado</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="text-3xl font-bold">2.500+</div>
              <div className="text-sm opacity-90">Clientes Satisfeitos</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-sm opacity-90">Avaliação 5.0</div>
            </div>
          </div>
        </div>
      </header>

      {/* Trust Badges */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
              <div className="bg-green-100 p-3 rounded-xl">
                <Shield className="size-6 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Garantia</p>
                <p className="text-sm text-gray-600">de Procedência</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
              <div className="bg-blue-100 p-3 rounded-xl">
                <Award className="size-6 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Veículos</p>
                <p className="text-sm text-gray-600">Revisados</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
              <div className="bg-yellow-100 p-3 rounded-xl">
                <Zap className="size-6 text-yellow-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Entrega</p>
                <p className="text-sm text-gray-600">Rápida</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-3 text-center md:text-left">
              <div className="bg-green-100 p-3 rounded-xl">
                <DollarSign className="size-6 text-green-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">Financiamento</p>
                <p className="text-sm text-gray-600">em até 48x</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sobre a Loja */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Sobre a {store.name}</h2>
              <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: primaryColor }}></div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Tradição e Qualidade desde 2009</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  A <strong>{store.name}</strong> é referência no mercado de veículos seminovos e usados. 
                  Com mais de <strong>15 anos de experiência</strong>, oferecemos os melhores carros com procedência garantida, 
                  revisão completa e atendimento personalizado.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Nossa missão é proporcionar a melhor experiência na compra do seu veículo, com transparência, 
                  segurança e as melhores condições de pagamento do mercado.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Badge className="bg-green-100 text-green-800 px-4 py-2 text-sm">✓ Veículos Inspecionados</Badge>
                  <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm">✓ Garantia Inclusa</Badge>
                  <Badge className="bg-purple-100 text-purple-800 px-4 py-2 text-sm">✓ Aceita Troca</Badge>
                </div>
              </div>

              <div className="space-y-6">
                <Card className="border-2 hover:border-blue-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="bg-blue-100 p-3 rounded-xl">
                        <Users className="size-6 text-blue-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Equipe Especializada</h4>
                    </div>
                    <p className="text-gray-600">Profissionais treinados para te ajudar na melhor escolha</p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-blue-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="bg-green-100 p-3 rounded-xl">
                        <ThumbsUp className="size-6 text-green-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Avaliação 5 Estrelas</h4>
                    </div>
                    <p className="text-gray-600">Mais de 2.500 clientes satisfeitos e avaliações positivas</p>
                  </CardContent>
                </Card>

                <Card className="border-2 hover:border-blue-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="bg-purple-100 p-3 rounded-xl">
                        <TrendingUp className="size-6 text-purple-600" />
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Melhores Condições</h4>
                    </div>
                    <p className="text-gray-600">Financiamento facilitado e taxas competitivas</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Nossos Diferenciais */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Por que Comprar Conosco?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Vantagens exclusivas que fazem da {store.name} a melhor escolha
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Wrench, title: 'Revisão Completa', description: 'Todos os veículos passam por revisão técnica de 150 pontos antes da venda', color: 'from-red-500 to-pink-600' },
              { icon: FileText, title: 'Documentação', description: 'Toda documentação verificada e regularizada. Compramos débitos pendentes', color: 'from-blue-500 to-blue-600' },
              { icon: CreditCard, title: 'Financiamento', description: 'Parceria com os melhores bancos. Aprovação em até 24h', color: 'from-green-500 to-green-600' },
              { icon: Shield, title: 'Garantia Estendida', description: 'Opção de garantia de motor e câmbio por até 12 meses', color: 'from-purple-500 to-purple-600' },
              { icon: Car, title: 'Aceita Troca', description: 'Avaliamos seu usado na hora e damos o melhor preço', color: 'from-yellow-500 to-orange-500' },
              { icon: MessageCircle, title: 'Atendimento VIP', description: 'Suporte personalizado antes, durante e após a compra', color: 'from-indigo-500 to-indigo-600' }
            ].map((item, idx) => (
              <Card key={idx} className="border-2 hover:border-blue-200 hover:shadow-xl transition-all group">
                <CardContent className="p-6">
                  <div className={`bg-gradient-to-br ${item.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <item.icon className="size-7 text-white" />
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Filters Bar */}
      <div className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
              <Input
                placeholder="Buscar por marca ou modelo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 border-2"
              />
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-56 h-12 border-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Mais Recentes</SelectItem>
                <SelectItem value="price-asc">Menor Preço</SelectItem>
                <SelectItem value="price-desc">Maior Preço</SelectItem>
                <SelectItem value="year-desc">Mais Novo</SelectItem>
                <SelectItem value="km-asc">Menor KM</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Button */}
            <Button 
              variant="outline" 
              className="h-12 gap-2 border-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="size-4" />
              Filtros
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2 bg-blue-600 text-white">
                  Ativos
                </Badge>
              )}
            </Button>
          </div>

          {/* Filtros Avançados */}
          {showFilters && (
            <div className="mt-4 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-blue-100 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-lg">Filtros Avançados</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="text-blue-600">
                    Limpar Tudo
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                    <X className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Marca */}
                <div className="space-y-2">
                  <Label className="font-semibold">Marca</Label>
                  <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                    <SelectTrigger className="border-2 bg-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as marcas</SelectItem>
                      {uniqueBrands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Preço */}
                <div className="space-y-2">
                  <Label className="font-semibold">Faixa de Preço</Label>
                  <div className="pt-2">
                    <Slider
                      min={0}
                      max={500000}
                      step={5000}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="mb-3"
                    />
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                      <span>R$ {priceRange[0].toLocaleString('pt-BR')}</span>
                      <span>R$ {priceRange[1].toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>

                {/* Ano */}
                <div className="space-y-2">
                  <Label className="font-semibold">Ano do Veículo</Label>
                  <div className="pt-2">
                    <Slider
                      min={1920}
                      max={2026}
                      step={1}
                      value={yearRange}
                      onValueChange={(value) => setYearRange(value as [number, number])}
                      className="mb-3"
                    />
                    <div className="flex justify-between text-sm font-medium text-gray-700">
                      <span>{yearRange[0]}</span>
                      <span>{yearRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Results Count */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            <span style={{ color: primaryColor }}>{filteredVehicles.length}</span> veículos encontrados
          </h2>
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredVehicles.map((vehicle) => {
            // A MAGICA: Lendo a imagem da tabela relacionada
            const coverImage = vehicle.images && vehicle.images.length > 0 ? vehicle.images[0].url : null;
            
            return (
              <Card 
                key={vehicle.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group border-2 hover:border-blue-300"
                onClick={() => {
                  setSelectedVehicle(vehicle);
                }}
              >
                <div className="aspect-video bg-gray-200 relative overflow-hidden flex items-center justify-center">
                  {coverImage ? (
                    <img src={coverImage} alt={vehicle.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <Car className="size-16 opacity-50 mb-2" />
                      <span className="text-sm font-medium">Foto Indisponível</span>
                    </div>
                  )}
                  
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-white text-gray-900 font-bold shadow-lg">
                      {vehicle.year}
                    </Badge>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('Adicionado aos favoritos!');
                      }}
                      className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:bg-white transition-all shadow-lg hover:scale-110"
                    >
                      <Heart className="size-5 text-gray-700" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success('Link copiado para área de transferência!');
                      }}
                      className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full hover:bg-white transition-all shadow-lg hover:scale-110"
                    >
                      <Share2 className="size-5 text-gray-700" />
                    </button>
                  </div>
                </div>
                
                <CardContent className="p-5">
                  <h3 className="font-bold text-2xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {vehicle.brand} {vehicle.model}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <Calendar className="size-4 text-gray-500" />
                      <span className="font-medium">{vehicle.year}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <Gauge className="size-4 text-gray-500" />
                      <span className="font-medium">{vehicle.km.toLocaleString('pt-BR')} km</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <Fuel className="size-4 text-gray-500" />
                      <span className="font-medium">Flex</span>
                    </div>
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                      <Cog className="size-4 text-gray-500" />
                      <span className="font-medium">Auto</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {vehicle.description || "Veículo em excelente estado, com garantia e revisado. Ótima oportunidade!"}
                  </p>

                  <div className="border-t pt-4 mb-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-xs text-gray-500">A partir de</span>
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <p 
                        className="text-4xl font-bold"
                        style={{ color: primaryColor }}
                      >
                        R$ {vehicle.price.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <p className="text-xs text-gray-600 bg-green-50 px-3 py-1.5 rounded-lg inline-block">
                      ou <strong>48x de R$ {(vehicle.price / 48).toLocaleString('pt-BR', {maximumFractionDigits: 0})}</strong> s/ juros
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 h-12 font-semibold shadow-lg text-white"
                      style={{ backgroundColor: primaryColor }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVehicle(vehicle);
                        setIsContactDialogOpen(true);
                      }}
                    >
                      <MessageCircle className="size-5 mr-2" />
                      Tenho Interesse
                    </Button>
                    <Button 
                      variant="outline"
                      size="icon"
                      className="h-12 w-12 border-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        const whatsappUrl = `https://wa.me/${store.phone?.replace(/\D/g, '')}?text=Olá! Tenho interesse no ${vehicle.brand} ${vehicle.model}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                    >
                      <Phone className="size-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredVehicles.length === 0 && (
          <Card className="border-2">
            <CardContent className="p-16 text-center">
              <Car className="size-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Nenhum veículo encontrado</h3>
              <p className="text-gray-600 mb-6">Tente ajustar os filtros ou fazer uma nova busca</p>
              <Button variant="outline" onClick={resetFilters} className="border-2">
                <X className="size-4 mr-2" />
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Vehicle Detail Dialog */}
      {selectedVehicle && !isContactDialogOpen && (
        <Dialog open={!!selectedVehicle} onOpenChange={() => setSelectedVehicle(null)}>
          <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold">
                {selectedVehicle.brand} {selectedVehicle.model} - {selectedVehicle.year}
              </DialogTitle>
              <DialogDescription>
                Confira todos os detalhes deste veículo
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-8">
              {/* Leitura da imagem principal no modal */}
              <div className="relative aspect-video bg-gray-100 rounded-xl flex items-center justify-center shadow-inner overflow-hidden">
                {selectedVehicle.images && selectedVehicle.images.length > 0 ? (
                  <img src={selectedVehicle.images[0].url} alt="Carro" className="w-full h-full object-cover" />
                ) : (
                  <Car className="size-32 text-gray-300" />
                )}
              </div>

              {/* Vehicle Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center border-2 border-blue-200">
                  <Calendar className="size-8 mx-auto mb-3 text-blue-600" />
                  <p className="text-xs text-gray-600 mb-1">Ano/Modelo</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedVehicle.year}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center border-2 border-green-200">
                  <Gauge className="size-8 mx-auto mb-3 text-green-600" />
                  <p className="text-xs text-gray-600 mb-1">Quilometragem</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {selectedVehicle.km.toLocaleString('pt-BR')} km
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center border-2 border-purple-200">
                  <Fuel className="size-8 mx-auto mb-3 text-purple-600" />
                  <p className="text-xs text-gray-600 mb-1">Combustível</p>
                  <p className="text-2xl font-bold text-gray-900">Flex</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl text-center border-2 border-orange-200">
                  <Cog className="size-8 mx-auto mb-3 text-orange-600" />
                  <p className="text-xs text-gray-600 mb-1">Câmbio</p>
                  <p className="text-2xl font-bold text-gray-900">Automático</p>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 rounded-2xl border-2 border-blue-200">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Preço à vista com desconto</p>
                    <p 
                      className="text-5xl font-bold mb-3"
                      style={{ color: primaryColor }}
                    >
                      R$ {selectedVehicle.price.toLocaleString('pt-BR')}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <p className="text-sm text-gray-700 bg-white px-4 py-2 rounded-lg font-semibold shadow-sm">
                        💳 <strong>48x de R$ {(selectedVehicle.price / 48).toLocaleString('pt-BR', {maximumFractionDigits:0})}</strong> sem juros
                      </p>
                      <p className="text-sm text-gray-700 bg-white px-4 py-2 rounded-lg font-semibold shadow-sm">
                        🤝 <strong>Aceita troca</strong> - Avaliamos seu usado
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white text-base px-6 py-3 shadow-lg border-0">
                    <Check className="size-6 mr-2" />
                    Garantia Inclusa
                  </Badge>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-2xl flex items-center gap-2">
                  <FileText className="size-6 text-blue-600" />
                  Descrição Completa
                </h3>
                <p className="text-gray-700 leading-relaxed text-lg bg-gray-50 p-6 rounded-xl border border-gray-100">
                  {selectedVehicle.description || "Veículo impecável. Agende uma visita na loja para conferir de perto!"}
                </p>
              </div>

              {/* Features List */}
              <div>
                <h3 className="font-bold text-gray-900 mb-6 text-2xl flex items-center gap-2">
                  <Check className="size-6 text-blue-600" />
                  Características e Equipamentos
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Ar condicionado digital', 'Direção elétrica', 'Vidros elétricos',
                    'Travas elétricas', 'Airbags frontais e laterais', 'Freios ABS',
                    'Sensor de estacionamento', 'Câmera de ré', 'Central multimídia',
                    'Bluetooth', 'Controle de tração', 'Rodas de liga leve'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm bg-gray-50 px-4 py-3 rounded-lg border border-gray-100">
                      <div className="bg-green-100 rounded-full p-1">
                        <Check className="size-4 text-green-600" />
                      </div>
                      <span className="font-medium text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t-2">
                <Button 
                  className="flex-1 h-16 text-lg font-bold shadow-xl text-white"
                  style={{ backgroundColor: primaryColor }}
                  onClick={() => {
                    setIsContactDialogOpen(true);
                  }}
                >
                  <MessageCircle className="size-6 mr-2" />
                  Demonstrar Interesse
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="h-16 px-8 text-lg font-bold border-2"
                  onClick={() => {
                    const whatsappUrl = `https://wa.me/${store.phone?.replace(/\D/g, '')}?text=Olá! Tenho interesse no ${selectedVehicle.brand} ${selectedVehicle.model}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                >
                  <Phone className="size-6 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Contact Form Dialog (Onde o Lead Nasce!) */}
      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Demonstrar Interesse</DialogTitle>
            <DialogDescription>
              Preencha seus dados e receba um código QR para atendimento prioritário
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleContactSubmit} className="space-y-5">
            {selectedVehicle && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl flex items-center gap-4 border-2 border-blue-200">
                <div className="bg-blue-600 p-3 rounded-xl">
                  <Car className="size-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-lg">
                    {selectedVehicle.brand} {selectedVehicle.model}
                  </p>
                  <p className="text-sm text-gray-600 font-medium">
                    {selectedVehicle.year} • R$ {selectedVehicle.price.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="nome" className="text-base font-semibold">Nome Completo *</Label>
              <Input id="nome" name="customerName" required placeholder="Seu nome completo" className="h-12" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-base font-semibold">Telefone/WhatsApp *</Label>
              <Input 
                id="telefone" 
                name="customerPhone" 
                type="tel" 
                required 
                placeholder="(11) 98765-4321" 
                className="h-12"
              />
            </div>
            
            {/* Input oculto pra mandar o ID do carro na requisição */}
            <input type="hidden" name="vehicleId" value={selectedVehicle?.id} />

            <div className="bg-gradient-to-r from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-200">
              <div className="flex gap-3">
                <Clock className="size-6 text-green-600 shrink-0 mt-0.5" />
                <div className="text-sm text-green-900">
                  <p className="font-bold mb-2 text-base">🎯 Atendimento Prioritário!</p>
                  <ul className="space-y-1 text-green-800 font-medium">
                    <li>✓ Resposta em até 15 minutos</li>
                    <li>✓ Código QR único para você</li>
                    <li>✓ Vendedor dedicado</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1 h-14 text-base font-bold shadow-lg text-white" 
                style={{ backgroundColor: primaryColor }}
              >
                {isSubmitting ? "Enviando..." : "Enviar Interesse"}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                className="h-14 border-2"
                onClick={() => setIsContactDialogOpen(false)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300 py-16 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">{store.name}</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Mais de 15 anos de experiência no mercado de veículos seminovos e usados. 
                Qualidade, transparência e as melhores condições.
              </p>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-2">Avaliação 5.0 - 2.500+ clientes</p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Contato</h4>
              <div className="space-y-4">
                {store.phone && (
                  <a href={`tel:${store.phone.replace(/\D/g, '')}`} className="flex items-center gap-3 hover:text-white transition-colors group">
                    <div className="bg-blue-600 p-2.5 rounded-lg group-hover:bg-blue-500 transition-colors">
                      <Phone className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Telefone</p>
                      <p className="font-semibold">{store.phone}</p>
                    </div>
                  </a>
                )}
                
                {store.address && (
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-600 p-2.5 rounded-lg">
                      <MapPin className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Endereço</p>
                      <p className="font-semibold">{store.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6 text-lg">Horário de Funcionamento</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span>Segunda a Sexta</span>
                  <span className="font-semibold">09:00 - 19:00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span>Sábado</span>
                  <span className="font-semibold">09:00 - 17:00</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-700">
                  <span>Domingo</span>
                  <span className="font-semibold">Fechado</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} {store.name}. Todos os direitos reservados.
              </p>
              <p className="text-gray-500 text-xs flex items-center gap-1">
                Powered by <strong className="text-blue-400">LeadTrack</strong> - Atribuição Offline
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}