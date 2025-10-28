import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Page = 'auth' | 'dashboard' | 'card-order' | 'withdraw' | 'referral' | 'info' | 'support' | 'admin';

export default function Index() {
  const [currentPage, setCurrentPage] = useState<Page>('auth');
  const [isLogin, setIsLogin] = useState(true);
  const [balance, setBalance] = useState(0);
  const [userName, setUserName] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    
    setUserName(name || 'Пользователь');
    setCurrentPage('dashboard');
    toast.success(isLogin ? 'Вы вошли в систему!' : 'Регистрация успешна!');
  };

  const handleCardOrder = () => {
    toast.success('Бонус 500₽ будет зачислен после активации карты!');
  };

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const amount = formData.get('amount') as string;
    
    if (parseFloat(amount) > balance) {
      toast.error('Недостаточно средств на балансе');
      return;
    }
    
    toast.success(`Заявка на вывод ${amount}₽ отправлена!`);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText('https://alfacard.promo/ref/ABC123');
    toast.success('Реферальная ссылка скопирована!');
  };

  const AuthPage = () => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#9b87f5] via-[#D946EF] to-[#7E69AB]">
      <Card className="w-full max-w-md border-2 border-primary/20 shadow-2xl animate-fade-in">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Icon name="CreditCard" size={32} className="text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl text-center font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {isLogin ? 'Вход' : 'Регистрация'}
          </CardTitle>
          <CardDescription className="text-center text-base">
            {isLogin ? 'Войдите в свой аккаунт' : 'Создайте аккаунт и получите бонус'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Имя</Label>
              <Input id="name" name="name" placeholder="Введите ваше имя" required className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input id="phone" name="phone" type="tel" placeholder="+7 (999) 123-45-67" required className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input id="password" name="password" type="password" placeholder="Введите пароль" required className="h-12" />
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all">
              {isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Нет аккаунта? Регистрация' : 'Уже есть аккаунт? Войти'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );

  const DashboardPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <div className="container max-w-6xl mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Привет, {userName}! 👋
            </h1>
            <p className="text-muted-foreground mt-2">Добро пожаловать в личный кабинет</p>
          </div>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary">
                <Icon name="Menu" size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-80 bg-sidebar border-l-2 border-primary/20">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold">Меню</SheetTitle>
              </SheetHeader>
              <div className="space-y-2 mt-8">
                {[
                  { icon: 'CreditCard', label: 'Оформить карту', page: 'card-order' as Page },
                  { icon: 'Wallet', label: 'Вывести средства', page: 'withdraw' as Page },
                  { icon: 'Users', label: 'Реферальная программа', page: 'referral' as Page },
                  { icon: 'Info', label: 'Информация о сайте', page: 'info' as Page },
                  { icon: 'MessageCircle', label: 'Техподдержка', page: 'support' as Page },
                  { icon: 'Shield', label: 'Админ-панель', page: 'admin' as Page },
                ].map((item) => (
                  <Button
                    key={item.page}
                    variant="ghost"
                    className="w-full justify-start h-14 text-base hover:bg-sidebar-accent"
                    onClick={() => {
                      setCurrentPage(item.page);
                      setMenuOpen(false);
                    }}
                  >
                    <Icon name={item.icon} size={20} className="mr-3" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <Card className="border-2 border-primary/30 shadow-xl bg-gradient-to-br from-card to-primary/5 animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Icon name="Wallet" size={28} className="mr-3 text-primary" />
              Баланс
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {balance} ₽
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: 'CreditCard', title: 'Оформить карту', desc: 'Получите 1000₽ бонусом', color: 'from-primary to-secondary', page: 'card-order' as Page },
            { icon: 'Users', title: 'Пригласи друзей', desc: '200₽ за каждого друга', color: 'from-secondary to-accent', page: 'referral' as Page },
            { icon: 'Wallet', title: 'Вывести деньги', desc: 'Через СБП без комиссий', color: 'from-accent to-primary', page: 'withdraw' as Page },
          ].map((card) => (
            <Card
              key={card.page}
              className="cursor-pointer hover:scale-105 transition-all border-2 border-primary/20 hover:border-primary/50 animate-fade-in hover-scale"
              onClick={() => setCurrentPage(card.page)}
            >
              <CardContent className="p-6 space-y-3">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                  <Icon name={card.icon} size={28} className="text-white" />
                </div>
                <h3 className="font-bold text-xl">{card.title}</h3>
                <p className="text-muted-foreground">{card.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  const CardOrderPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-4">
      <div className="container max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => setCurrentPage('dashboard')} className="mb-4">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>
        
        <Card className="border-2 border-secondary/30 shadow-xl animate-fade-in">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-lg">
              <Icon name="Gift" size={40} className="text-white" />
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Получите 1000₽ бонусом!
            </CardTitle>
            <CardDescription className="text-lg">
              500₽ от нас + 500₽ от Альфа-Банка
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-6 rounded-xl space-y-4">
              <h3 className="font-bold text-xl flex items-center">
                <Icon name="ListChecks" size={24} className="mr-3 text-secondary" />
                Инструкция по оформлению:
              </h3>
              <ol className="space-y-3 list-decimal list-inside text-foreground/90">
                <li className="pl-2">Перейдите по ссылке и оформите карту</li>
                <li className="pl-2">Загрузите приложение банка и активируйте карту</li>
                <li className="pl-2">Совершите покупку минимум на 200₽</li>
                <li className="pl-2">Скриншот чека пришлите в поддержку @Alfa_Bank778</li>
              </ol>
            </div>
            
            <div className="flex flex-col gap-4">
              <Button
                size="lg"
                className="h-16 text-xl font-bold bg-gradient-to-r from-secondary to-accent hover:opacity-90"
                onClick={handleCardOrder}
              >
                <Icon name="ExternalLink" size={24} className="mr-3" />
                Оформить карту
              </Button>
              
              <div className="p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-center text-muted-foreground">
                  ✨ Бесплатное обслуживание • Кэшбэк каждый месяц
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const WithdrawPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-4">
      <div className="container max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => setCurrentPage('dashboard')} className="mb-4">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>
        
        <Card className="border-2 border-accent/30 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
              <Icon name="Wallet" size={32} className="mr-3 text-accent" />
              Вывод средств
            </CardTitle>
            <CardDescription className="text-base">
              Доступно к выводу: <span className="font-bold text-accent">{balance}₽</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWithdraw} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-base">Сумма вывода</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  placeholder="Введите сумму"
                  required
                  className="h-14 text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base">Номер телефона (СБП)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  required
                  className="h-14 text-lg"
                />
              </div>
              
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <Icon name="Info" size={16} className="inline mr-2" />
                  Вывод осуществляется через Систему Быстрых Платежей (СБП) без комиссии
                </p>
              </div>
              
              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-xl font-bold bg-gradient-to-r from-accent to-secondary hover:opacity-90"
              >
                <Icon name="Send" size={24} className="mr-3" />
                Вывести средства
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const ReferralPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4">
      <div className="container max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => setCurrentPage('dashboard')} className="mb-4">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>
        
        <Card className="border-2 border-primary/30 shadow-xl animate-fade-in">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <Icon name="Users" size={40} className="text-white" />
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Реферальная программа
            </CardTitle>
            <CardDescription className="text-lg">
              Приглашай друзей и зарабатывай вместе!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardContent className="p-6 text-center space-y-2">
                  <div className="text-5xl font-bold text-primary">200₽</div>
                  <p className="text-muted-foreground">За каждого друга</p>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-secondary/20 bg-gradient-to-br from-secondary/5 to-transparent">
                <CardContent className="p-6 text-center space-y-2">
                  <div className="text-5xl font-bold text-secondary">0</div>
                  <p className="text-muted-foreground">Приглашено друзей</p>
                </CardContent>
              </Card>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-bold text-xl">Ваша реферальная ссылка:</h3>
              <div className="flex gap-2">
                <Input
                  value="https://alfacard.promo/ref/ABC123"
                  readOnly
                  className="h-14 text-base"
                />
                <Button
                  size="lg"
                  onClick={copyReferralLink}
                  className="bg-gradient-to-r from-primary to-secondary"
                >
                  <Icon name="Copy" size={20} />
                </Button>
              </div>
            </div>
            
            <div className="bg-muted p-6 rounded-xl space-y-3">
              <h3 className="font-bold text-xl flex items-center">
                <Icon name="Lightbulb" size={24} className="mr-3 text-primary" />
                Как это работает:
              </h3>
              <ul className="space-y-2 list-disc list-inside text-foreground/90">
                <li className="pl-2">Отправь ссылку другу</li>
                <li className="pl-2">Друг регистрируется и оформляет карту</li>
                <li className="pl-2">Вы оба получаете бонусы!</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const InfoPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-4">
      <div className="container max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => setCurrentPage('dashboard')} className="mb-4">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>
        
        <Card className="border-2 border-secondary/30 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
              <Icon name="Info" size={32} className="mr-3 text-secondary" />
              Информация о сайте
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-foreground/90 leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-bold text-xl text-secondary">О платформе</h3>
              <p>
                Наша платформа помогает получить выгодные банковские карты с бонусами.
                Мы сотрудничаем с Альфа-Банком, чтобы предоставить вам максимальную выгоду.
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h3 className="font-bold text-xl text-secondary">Условия участия</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>Возраст от 18 лет</li>
                <li>Гражданство РФ</li>
                <li>Наличие мобильного телефона</li>
                <li>Оформление карты впервые</li>
              </ul>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <h3 className="font-bold text-xl text-secondary">Безопасность</h3>
              <p>
                Все данные передаются по защищенному каналу. Мы не храним банковские данные
                и работаем напрямую с официальными партнерами.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const SupportPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/10 p-4">
      <div className="container max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => setCurrentPage('dashboard')} className="mb-4">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>
        
        <Card className="border-2 border-accent/30 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
              <Icon name="MessageCircle" size={32} className="mr-3 text-accent" />
              Техподдержка
            </CardTitle>
            <CardDescription className="text-base">
              Мы всегда готовы помочь вам!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Card className="border-2 border-accent/20 hover:border-accent/50 transition-all cursor-pointer hover-scale">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
                    <Icon name="Send" size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Telegram</h3>
                    <p className="text-muted-foreground">@Alfa_Bank778</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-2 border-primary/20 hover:border-primary/50 transition-all cursor-pointer hover-scale">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <Icon name="Mail" size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Email</h3>
                    <p className="text-muted-foreground">support@alfacard.promo</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="bg-muted p-6 rounded-xl">
              <h3 className="font-bold text-lg mb-3 flex items-center">
                <Icon name="Clock" size={20} className="mr-2 text-accent" />
                Время работы
              </h3>
              <p className="text-foreground/90">Ежедневно с 9:00 до 21:00 (МСК)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const AdminPage = () => (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4">
      <div className="container max-w-6xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => setCurrentPage('dashboard')} className="mb-4">
          <Icon name="ArrowLeft" size={20} className="mr-2" />
          Назад
        </Button>
        
        <Card className="border-2 border-primary/30 shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-3xl font-bold flex items-center">
              <Icon name="Shield" size={32} className="mr-3 text-primary" />
              Админ-панель
            </CardTitle>
            <CardDescription className="text-base">
              Управление пользователями и выплатами
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { icon: 'Users', title: 'Пользователи', value: '0', color: 'from-primary to-secondary' },
                { icon: 'Wallet', title: 'Всего выплачено', value: '0₽', color: 'from-secondary to-accent' },
                { icon: 'TrendingUp', title: 'Активных карт', value: '0', color: 'from-accent to-primary' },
              ].map((stat) => (
                <Card key={stat.title} className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
                  <CardContent className="p-6 space-y-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon name={stat.icon} size={24} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="font-bold text-xl">Последние пользователи</h3>
              <div className="bg-muted p-8 rounded-xl text-center text-muted-foreground">
                <Icon name="Users" size={48} className="mx-auto mb-4 opacity-50" />
                <p>Пока нет зарегистрированных пользователей</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const pages = {
    auth: <AuthPage />,
    dashboard: <DashboardPage />,
    'card-order': <CardOrderPage />,
    withdraw: <WithdrawPage />,
    referral: <ReferralPage />,
    info: <InfoPage />,
    support: <SupportPage />,
    admin: <AdminPage />,
  };

  return pages[currentPage];
}
