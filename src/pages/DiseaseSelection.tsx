import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTropiScanStore } from '@/store/useTropiScanStore';
import { diseases } from '@/data/diseases';
import { DiseaseType } from '@/types/tropiscan';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function DiseaseSelection() {
  const navigate = useNavigate();
  const { setSelectedDisease, resetTriagem } = useTropiScanStore();
  const [selectedDisease, setLocalSelectedDisease] = useState<DiseaseType | null>(null);

  const handleDiseaseSelect = (diseaseId: DiseaseType) => {
    setLocalSelectedDisease(diseaseId);
    setSelectedDisease(diseaseId);
    resetTriagem();
    
    // Navigate to consent page after a brief delay
    setTimeout(() => {
      navigate('/consentimento');
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-12">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="mb-6 text-teal-600 hover:text-teal-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao início
            </Button>
            
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Selecione a Doença
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Escolha a doença negligenciada para a qual deseja realizar a triagem de risco
            </p>
          </motion.div>

          {/* Disease Cards */}
          <motion.div variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {diseases.map((disease) => (
              <motion.div key={disease.id} variants={fadeUp}>
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 ${
                    selectedDisease === disease.id 
                      ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20' 
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                  onClick={() => handleDiseaseSelect(disease.id)}
                >
                  <CardHeader className="text-center pb-4">
                    <div 
                      className="text-6xl mb-4 mx-auto w-20 h-20 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${disease.color}20` }}
                    >
                      {disease.icon}
                    </div>
                    <CardTitle 
                      className="text-xl font-bold"
                      style={{ color: disease.color }}
                    >
                      {disease.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600 dark:text-gray-300 mb-4">
                      {disease.description}
                    </CardDescription>
                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="group"
                        style={{ borderColor: disease.color, color: disease.color }}
                      >
                        Iniciar Triagem
                        <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Additional Disease - Leishmaniasis */}
          <motion.div variants={fadeUp}>
            <Card 
              className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 border-gray-200 hover:border-green-300"
              onClick={() => {
                setSelectedDisease(null); // null represents leishmaniasis (original disease)
                resetTriagem();
                setTimeout(() => navigate('/consentimento'), 300);
              }}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-6xl mb-4 mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
                  🦟
                </div>
                <CardTitle className="text-xl font-bold text-green-600">
                  Leishmaniose
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 dark:text-gray-300 mb-4">
                  Doença parasitária transmitida por flebotomíneos (mosquito-palha)
                </CardDescription>
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="group border-green-500 text-green-600"
                  >
                    Iniciar Triagem
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Section */}
          <motion.div variants={fadeUp} className="mt-12 text-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Sobre o TropiScan
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                O TropiScan é um portal completo para identificação e triagem de doenças negligenciadas 
                na América Latina. Utilizamos questionários validados e inteligência artificial para 
                auxiliar na detecção precoce e orientação médica adequada.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}