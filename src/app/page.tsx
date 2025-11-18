'use client'

import { useState, useEffect } from 'react'
import { Moon, Star, Calendar, Plus, Search, Filter, BookOpen, Brain, Sparkles, Tag, Clock, TrendingUp, CheckCircle, AlertCircle, Coffee, Bed, Sun, Activity, Zap, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'

interface SleepAssessment {
  id: string
  date: string
  sleepQuality: number
  sleepDuration: number
  bedtime: string
  wakeTime: string
  sleepLatency: number
  nightAwakenings: number
  morningMood: string
  energyLevel: number
  caffeineIntake: number
  screenTime: number
  exerciseHours: number
  stressLevel: number
  sleepEnvironment: string
  answers: Record<string, any>
}

const sleepQuestions = [
  {
    id: 'sleepQuality',
    question: 'Como você avalia a qualidade do seu sono na noite passada?',
    type: 'scale',
    scale: { min: 1, max: 10, labels: ['Muito ruim', 'Excelente'] }
  },
  {
    id: 'sleepDuration',
    question: 'Quantas horas você dormiu?',
    type: 'number',
    min: 0,
    max: 24,
    step: 0.5
  },
  {
    id: 'bedtime',
    question: 'Que horas você foi dormir?',
    type: 'time'
  },
  {
    id: 'wakeTime',
    question: 'Que horas você acordou?',
    type: 'time'
  },
  {
    id: 'sleepLatency',
    question: 'Quanto tempo levou para adormecer? (em minutos)',
    type: 'number',
    min: 0,
    max: 180
  },
  {
    id: 'nightAwakenings',
    question: 'Quantas vezes você acordou durante a noite?',
    type: 'select',
    options: [
      { value: '0', label: 'Nenhuma vez' },
      { value: '1', label: '1 vez' },
      { value: '2', label: '2 vezes' },
      { value: '3', label: '3 vezes' },
      { value: '4+', label: '4 ou mais vezes' }
    ]
  },
  {
    id: 'morningMood',
    question: 'Como você se sentiu ao acordar?',
    type: 'select',
    options: [
      { value: 'refreshed', label: '😊 Descansado e revigorado' },
      { value: 'okay', label: '😐 Normal' },
      { value: 'tired', label: '😴 Cansado' },
      { value: 'groggy', label: '😵 Sonolento e confuso' },
      { value: 'exhausted', label: '😫 Exausto' }
    ]
  },
  {
    id: 'energyLevel',
    question: 'Qual seu nível de energia durante o dia?',
    type: 'scale',
    scale: { min: 1, max: 10, labels: ['Muito baixo', 'Muito alto'] }
  },
  {
    id: 'caffeineIntake',
    question: 'Quantas xícaras de café/chá você tomou ontem?',
    type: 'number',
    min: 0,
    max: 20
  },
  {
    id: 'screenTime',
    question: 'Quantas horas você usou telas antes de dormir?',
    type: 'select',
    options: [
      { value: '0', label: 'Nenhuma' },
      { value: '0.5', label: '30 minutos' },
      { value: '1', label: '1 hora' },
      { value: '2', label: '2 horas' },
      { value: '3+', label: '3+ horas' }
    ]
  },
  {
    id: 'exerciseHours',
    question: 'Quantas horas você se exercitou ontem?',
    type: 'number',
    min: 0,
    max: 8,
    step: 0.5
  },
  {
    id: 'stressLevel',
    question: 'Qual foi seu nível de estresse ontem?',
    type: 'scale',
    scale: { min: 1, max: 10, labels: ['Muito baixo', 'Muito alto'] }
  },
  {
    id: 'sleepEnvironment',
    question: 'Como estava o ambiente do seu quarto?',
    type: 'select',
    options: [
      { value: 'ideal', label: '🌙 Escuro, silencioso e fresco' },
      { value: 'good', label: '✅ Bom, com pequenos ruídos/luz' },
      { value: 'okay', label: '😐 Razoável' },
      { value: 'poor', label: '😕 Barulhento ou muito claro' },
      { value: 'bad', label: '😣 Muito ruim (muito quente, barulho, luz)' }
    ]
  }
]

export default function DreamWellApp() {
  const [assessments, setAssessments] = useState<SleepAssessment[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [showPricing, setShowPricing] = useState(true)

  // Carregar dados do localStorage
  useEffect(() => {
    const savedAssessments = localStorage.getItem('sleepAssessments')
    if (savedAssessments) {
      setAssessments(JSON.parse(savedAssessments))
    }
  }, [])

  // Salvar dados no localStorage
  useEffect(() => {
    localStorage.setItem('sleepAssessments', JSON.stringify(assessments))
  }, [assessments])

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleNext = () => {
    if (currentQuestion < sleepQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    const newAssessment: SleepAssessment = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      sleepQuality: parseInt(answers.sleepQuality) || 5,
      sleepDuration: parseFloat(answers.sleepDuration) || 8,
      bedtime: answers.bedtime || '22:00',
      wakeTime: answers.wakeTime || '06:00',
      sleepLatency: parseInt(answers.sleepLatency) || 15,
      nightAwakenings: parseInt(answers.nightAwakenings) || 0,
      morningMood: answers.morningMood || 'okay',
      energyLevel: parseInt(answers.energyLevel) || 5,
      caffeineIntake: parseInt(answers.caffeineIntake) || 2,
      screenTime: parseFloat(answers.screenTime) || 1,
      exerciseHours: parseFloat(answers.exerciseHours) || 0,
      stressLevel: parseInt(answers.stressLevel) || 5,
      sleepEnvironment: answers.sleepEnvironment || 'good',
      answers
    }

    setAssessments(prev => [newAssessment, ...prev])
    setAnswers({})
    setCurrentQuestion(0)
    setIsDialogOpen(false)
  }

  const getStats = () => {
    if (assessments.length === 0) return { avgQuality: 0, avgDuration: 0, avgLatency: 0, totalAssessments: 0 }
    
    const avgQuality = assessments.reduce((sum, a) => sum + a.sleepQuality, 0) / assessments.length
    const avgDuration = assessments.reduce((sum, a) => sum + a.sleepDuration, 0) / assessments.length
    const avgLatency = assessments.reduce((sum, a) => sum + a.sleepLatency, 0) / assessments.length
    
    return {
      avgQuality: Math.round(avgQuality * 10) / 10,
      avgDuration: Math.round(avgDuration * 10) / 10,
      avgLatency: Math.round(avgLatency),
      totalAssessments: assessments.length
    }
  }

  const getSleepScore = (assessment: SleepAssessment) => {
    let score = 0
    
    // Qualidade do sono (30%)
    score += (assessment.sleepQuality / 10) * 30
    
    // Duração do sono (25%)
    const durationScore = assessment.sleepDuration >= 7 && assessment.sleepDuration <= 9 ? 1 : 
                         assessment.sleepDuration >= 6 && assessment.sleepDuration <= 10 ? 0.8 :
                         assessment.sleepDuration >= 5 && assessment.sleepDuration <= 11 ? 0.6 : 0.4
    score += durationScore * 25
    
    // Latência do sono (15%)
    const latencyScore = assessment.sleepLatency <= 15 ? 1 :
                        assessment.sleepLatency <= 30 ? 0.8 :
                        assessment.sleepLatency <= 45 ? 0.6 : 0.4
    score += latencyScore * 15
    
    // Despertares noturnos (15%)
    const awakeningsScore = assessment.nightAwakenings === 0 ? 1 :
                           assessment.nightAwakenings <= 1 ? 0.8 :
                           assessment.nightAwakenings <= 2 ? 0.6 : 0.4
    score += awakeningsScore * 15
    
    // Nível de energia (15%)
    score += (assessment.energyLevel / 10) * 15
    
    return Math.round(score)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente'
    if (score >= 60) return 'Bom'
    if (score >= 40) return 'Regular'
    return 'Precisa melhorar'
  }

  const getMoodEmoji = (mood: string) => {
    const moods: Record<string, string> = {
      refreshed: '😊',
      okay: '😐',
      tired: '😴',
      groggy: '😵',
      exhausted: '😫'
    }
    return moods[mood] || '😐'
  }

  const currentQuestionData = sleepQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / sleepQuestions.length) * 100
  const { avgQuality, avgDuration, avgLatency, totalAssessments } = getStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-indigo-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
              <Moon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              DreamWell
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Avalie e monitore a qualidade do seu sono
          </p>
        </div>

        {/* Pricing Section */}
        {showPricing && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Planos Acessíveis
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Escolha o plano ideal para melhorar seu sono
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Plano Gratuito */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl">Gratuito</CardTitle>
                    <Zap className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">R$ 0</span>
                    <span className="text-gray-600 dark:text-gray-400">/mês</span>
                  </div>
                  <CardDescription>Perfeito para começar</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Questionário completo de sono</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Até 7 avaliações por mês</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Estatísticas básicas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Armazenamento local</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-gray-600 hover:bg-gray-700" onClick={() => setShowPricing(false)}>
                    Começar Grátis
                  </Button>
                </CardContent>
              </Card>

              {/* Plano Básico */}
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-indigo-300 dark:border-indigo-600 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl">Básico</CardTitle>
                    <Star className="w-6 h-6 text-indigo-500" />
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">R$ 9,90</span>
                    <span className="text-gray-600 dark:text-gray-400">/mês</span>
                  </div>
                  <CardDescription>Ideal para uso regular</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Tudo do plano Gratuito</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Avaliações ilimitadas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Insights personalizados</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Gráficos de tendências</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Exportar relatórios PDF</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700" onClick={() => setShowPricing(false)}>
                    Assinar Básico
                  </Button>
                </CardContent>
              </Card>

              {/* Plano Premium */}
              <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-600/10 dark:from-indigo-500/20 dark:to-purple-600/20 backdrop-blur-sm border-2 border-indigo-500 dark:border-indigo-400 shadow-xl hover:shadow-2xl transition-all duration-300 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1">
                    Mais Popular
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-2xl">Premium</CardTitle>
                    <Crown className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">R$ 19,90</span>
                    <span className="text-gray-600 dark:text-gray-400">/mês</span>
                  </div>
                  <CardDescription>Experiência completa</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Tudo do plano Básico</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Análise com IA avançada</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Recomendações personalizadas</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Alertas e lembretes inteligentes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Sincronização na nuvem</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-300">Suporte prioritário</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 shadow-lg" onClick={() => setShowPricing(false)}>
                    Assinar Premium
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button variant="ghost" onClick={() => setShowPricing(false)} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                Continuar com plano gratuito →
              </Button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {!showPricing && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Avaliações
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {totalAssessments}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Noites registradas
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Qualidade Média
                  </CardTitle>
                  <Star className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {avgQuality}/10
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Avaliação subjetiva
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Duração Média
                  </CardTitle>
                  <Clock className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {avgDuration}h
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Horas de sono
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Tempo p/ Dormir
                  </CardTitle>
                  <Bed className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {avgLatency}min
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Latência média
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="assessments" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <TabsList className="grid w-full sm:w-auto grid-cols-2 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                  <TabsTrigger value="assessments" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Avaliações</span>
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Insights</span>
                  </TabsTrigger>
                </TabsList>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Avaliação
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Questionário de Avaliação do Sono</DialogTitle>
                      <DialogDescription>
                        Pergunta {currentQuestion + 1} de {sleepQuestions.length}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                      <Progress value={progress} className="w-full" />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                          {currentQuestionData.question}
                        </h3>
                        
                        {currentQuestionData.type === 'scale' && (
                          <div className="space-y-4">
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>{currentQuestionData.scale?.labels[0]}</span>
                              <span>{currentQuestionData.scale?.labels[1]}</span>
                            </div>
                            <div className="flex gap-2 justify-center flex-wrap">
                              {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
                                <button
                                  key={value}
                                  onClick={() => handleAnswerChange(currentQuestionData.id, value.toString())}
                                  className={`w-10 h-10 rounded-full border-2 font-medium transition-all ${
                                    answers[currentQuestionData.id] === value.toString()
                                      ? 'bg-indigo-500 text-white border-indigo-500'
                                      : 'border-gray-300 hover:border-indigo-300'
                                  }`}
                                >
                                  {value}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {currentQuestionData.type === 'select' && (
                          <Select 
                            value={answers[currentQuestionData.id] || ''} 
                            onValueChange={(value) => handleAnswerChange(currentQuestionData.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                            <SelectContent>
                              {currentQuestionData.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                        
                        {currentQuestionData.type === 'number' && (
                          <Input
                            type="number"
                            min={currentQuestionData.min}
                            max={currentQuestionData.max}
                            step={currentQuestionData.step || 1}
                            value={answers[currentQuestionData.id] || ''}
                            onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
                            placeholder="Digite um número"
                          />
                        )}
                        
                        {currentQuestionData.type === 'time' && (
                          <Input
                            type="time"
                            value={answers[currentQuestionData.id] || ''}
                            onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
                          />
                        )}
                      </div>
                      
                      <div className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={handlePrevious}
                          disabled={currentQuestion === 0}
                        >
                          Anterior
                        </Button>
                        <Button
                          onClick={handleNext}
                          disabled={!answers[currentQuestionData.id]}
                          className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                        >
                          {currentQuestion === sleepQuestions.length - 1 ? 'Finalizar' : 'Próxima'}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Assessments Tab */}
              <TabsContent value="assessments" className="space-y-6">
                <div className="space-y-4">
                  {assessments.length > 0 ? (
                    assessments.map((assessment) => {
                      const score = getSleepScore(assessment)
                      return (
                        <Card key={assessment.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                              <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-indigo-500" />
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      {new Date(assessment.date).toLocaleDateString('pt-BR', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                      })}
                                    </span>
                                  </div>
                                  <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
                                    {score}%
                                  </div>
                                  <Badge className={`${getScoreColor(score)} bg-opacity-10`}>
                                    {getScoreLabel(score)}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                  <div className="flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">Qualidade</div>
                                      <div className="font-medium">{assessment.sleepQuality}/10</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    <div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">Duração</div>
                                      <div className="font-medium">{assessment.sleepDuration}h</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Bed className="w-4 h-4 text-purple-500" />
                                    <div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">Horário</div>
                                      <div className="font-medium">{assessment.bedtime} - {assessment.wakeTime}</div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    <Sun className="w-4 h-4 text-orange-500" />
                                    <div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">Humor</div>
                                      <div className="font-medium">{getMoodEmoji(assessment.morningMood)}</div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex flex-wrap gap-2">
                                  <Badge variant="outline">
                                    Latência: {assessment.sleepLatency}min
                                  </Badge>
                                  <Badge variant="outline">
                                    Despertares: {assessment.nightAwakenings}
                                  </Badge>
                                  <Badge variant="outline">
                                    Energia: {assessment.energyLevel}/10
                                  </Badge>
                                  <Badge variant="outline">
                                    Cafeína: {assessment.caffeineIntake} xícaras
                                  </Badge>
                                  {assessment.exerciseHours > 0 && (
                                    <Badge variant="outline">
                                      Exercício: {assessment.exerciseHours}h
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  ) : (
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Moon className="w-16 h-16 text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                          Nenhuma avaliação registrada ainda
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                          Comece registrando sua primeira avaliação de sono para monitorar sua qualidade de descanso
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Insights Tab */}
              <TabsContent value="insights" className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Análise do Seu Sono</h2>
                
                {assessments.length >= 3 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-indigo-500" />
                          Tendência da Qualidade
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Qualidade média</span>
                            <span className="font-bold text-lg">{avgQuality}/10</span>
                          </div>
                          <Progress value={avgQuality * 10} className="w-full" />
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {avgQuality >= 7 
                              ? 'Sua qualidade de sono está excelente! Continue assim.'
                              : avgQuality >= 5
                              ? 'Sua qualidade de sono está razoável. Há espaço para melhorias.'
                              : 'Sua qualidade de sono precisa de atenção. Considere ajustar seus hábitos.'
                            }
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Clock className="w-5 h-5 text-blue-500" />
                          Padrão de Sono
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Duração média</span>
                            <span className="font-medium">{avgDuration}h</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-300">Tempo para dormir</span>
                            <span className="font-medium">{avgLatency}min</span>
                          </div>
                          <div className="mt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {avgDuration >= 7 && avgDuration <= 9
                                ? 'Sua duração de sono está dentro do recomendado (7-9h).'
                                : avgDuration < 7
                                ? 'Você está dormindo menos que o recomendado. Tente dormir mais cedo.'
                                : 'Você está dormindo mais que o usual. Verifique se há fatores externos.'
                              }
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-green-500" />
                          Fatores de Influência
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {(() => {
                            const avgCaffeine = assessments.reduce((sum, a) => sum + a.caffeineIntake, 0) / assessments.length
                            const avgStress = assessments.reduce((sum, a) => sum + a.stressLevel, 0) / assessments.length
                            const avgExercise = assessments.reduce((sum, a) => sum + a.exerciseHours, 0) / assessments.length
                            
                            return (
                              <>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600 dark:text-gray-300">Cafeína média</span>
                                  <span className="font-medium">{Math.round(avgCaffeine * 10) / 10} xícaras</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600 dark:text-gray-300">Estresse médio</span>
                                  <span className="font-medium">{Math.round(avgStress * 10) / 10}/10</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600 dark:text-gray-300">Exercício médio</span>
                                  <span className="font-medium">{Math.round(avgExercise * 10) / 10}h</span>
                                </div>
                              </>
                            )
                          })()}
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-purple-500" />
                          Recomendações
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {(() => {
                            const recommendations = []
                            const avgCaffeine = assessments.reduce((sum, a) => sum + a.caffeineIntake, 0) / assessments.length
                            const avgStress = assessments.reduce((sum, a) => sum + a.stressLevel, 0) / assessments.length
                            const avgExercise = assessments.reduce((sum, a) => sum + a.exerciseHours, 0) / assessments.length
                            
                            if (avgLatency > 30) recommendations.push('Pratique técnicas de relaxamento antes de dormir')
                            if (avgCaffeine > 3) recommendations.push('Reduza o consumo de cafeína, especialmente à tarde')
                            if (avgStress > 7) recommendations.push('Implemente práticas de redução de estresse')
                            if (avgExercise < 0.5) recommendations.push('Inclua atividade física regular na sua rotina')
                            if (avgDuration < 7) recommendations.push('Tente ir para a cama mais cedo')
                            
                            if (recommendations.length === 0) {
                              recommendations.push('Continue mantendo seus bons hábitos de sono!')
                            }
                            
                            return recommendations.slice(0, 3).map((rec, index) => (
                              <div key={index} className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-gray-600 dark:text-gray-300">{rec}</span>
                              </div>
                            ))
                          })()}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-lg">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Sparkles className="w-16 h-16 text-gray-400 mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                        Insights em Desenvolvimento
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-center">
                        Registre pelo menos 3 avaliações para ver análises personalizadas e recomendações
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  )
}