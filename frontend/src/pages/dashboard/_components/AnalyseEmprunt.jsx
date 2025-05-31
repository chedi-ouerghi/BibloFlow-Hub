import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <motion.div
    whileHover={{ y: -2 }}
    className={`bg-white p-6 rounded-xl border ${color} shadow-sm`}
  >
    <div className="flex items-center gap-4">
      <div className={`p-2 rounded-lg ${color.replace('border-', 'bg-').replace('100', '50')}`}>
        <Icon className={`w-8 h-8 ${color.replace('border-', 'text-').replace('100', '600')}`} />
      </div>
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </motion.div>
);

const AnalyseEmprunt = ({ emprunts = [], statistiques = {} }) => {
  // Calcul des statistiques si elles ne sont pas fournies
  const stats = {
    total: statistiques.total || emprunts.length || 0,
    enCours: statistiques.enCours || emprunts.filter(e => !e.estRendu).length || 0,
    rendus: statistiques.rendus || emprunts.filter(e => e.estRendu).length || 0,
    enRetard: statistiques.enRetard || emprunts.filter(e => !e.estRendu && e.estEnRetard).length || 0
  };

  // Calcul des statistiques supplémentaires
  const moyenneJoursEmprunt = emprunts.reduce((acc, emprunt) => {
    const dateEmprunt = new Date(emprunt.dateEmprunt);
    const dateRetour = emprunt.dateRetourEffective ? new Date(emprunt.dateRetourEffective) : new Date();
    const dureeJours = Math.floor((dateRetour - dateEmprunt) / (1000 * 60 * 60 * 24));
    return acc + dureeJours;
  }, 0) / (emprunts.length || 1);

  // Données pour le graphique de statut
  const statutData = [
    { name: 'En cours', value: statistiques.enCours },
    { name: 'En retard', value: statistiques.enRetard },
    { name: 'Rendus', value: statistiques.total - (statistiques.enCours + statistiques.enRetard) },
  ];

  // Données pour le graphique des emprunts par livre
  const empruntsParLivre = emprunts.reduce((acc, emprunt) => {
    const titre = emprunt.livreId.titre;
    acc[titre] = (acc[titre] || 0) + 1;
    return acc;
  }, {});

  const topLivres = Object.entries(empruntsParLivre)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([titre, nombre]) => ({
      name: titre.substring(0, 20) + (titre.length > 20 ? '...' : ''),
      emprunts: nombre,
    }));

  // Données pour le graphique des retards
  const retardsParJour = emprunts
    .filter(emprunt => emprunt.dureeRetard > 0)
    .sort((a, b) => b.dureeRetard - a.dureeRetard)
    .slice(0, 5)
    .map(emprunt => ({
      name: emprunt.livreId.titre.substring(0, 20) + (emprunt.livreId.titre.length > 20 ? '...' : ''),
      jours: emprunt.dureeRetard,
    }));

  // Couleurs pour les graphiques
  const COLORS = ['#4f46e5', '#ef4444', '#10b981', '#fbbf24'];

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerAnimation}
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 p-4"
    >
      {/* Vue d'ensemble */}
      <motion.div variants={itemAnimation} className="xl:col-span-4">
        <Card className="bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Vue d'ensemble des emprunts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-indigo-600">{statistiques.total}</p>
                <p className="text-sm font-medium text-gray-600">Total emprunts</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-yellow-500">{statistiques.enCours}</p>
                <p className="text-sm font-medium text-gray-600">En cours</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-red-500">{statistiques.enRetard}</p>
                <p className="text-sm font-medium text-gray-600">En retard</p>
              </div>
              <div className="p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
                <p className="text-3xl font-bold text-green-500">
                  {Math.round(moyenneJoursEmprunt)}
                </p>
                <p className="text-sm font-medium text-gray-600">Jours en moyenne</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Distribution des statuts */}
      <motion.div variants={itemAnimation} className="xl:col-span-2">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Distribution des Statuts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statutData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statutData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Livres les plus empruntés */}
      <motion.div variants={itemAnimation} className="xl:col-span-2">
        <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-800">
              Top 5 des Livres les Plus Empruntés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topLivres}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                  <YAxis allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="emprunts" 
                    fill="#4f46e5"
                    radius={[4, 4, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Retards */}
      {retardsParJour.length > 0 && (
        <motion.div variants={itemAnimation} className="xl:col-span-4">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold text-gray-800">
                Top 5 des Plus Longs Retards (en jours)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={retardsParJour}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                    <YAxis allowDecimals={false} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Bar 
                      dataKey="jours" 
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                      className="hover:opacity-80 transition-opacity"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AnalyseEmprunt;