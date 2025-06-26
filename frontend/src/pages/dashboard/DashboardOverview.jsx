import { useEffect, useState } from 'react';
import {
    BookCheck,
    LibraryBig,
    MessageSquareText,
    PenLine,
    Users
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Card } from "../../components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { motion } from "framer-motion";

const FloatingParticle = ({ delay = 0, top = "0%", left = "0%", size = "20px", color = "rgba(255,255,255,0.3)" }) => {
  return (
    <motion.div
      className="absolute rounded-full"
      style={{ 
        top, 
        left, 
        width: size, 
        height: size, 
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(1px)"
      }}
      initial={{ y: 0, opacity: 0 }}
      animate={{ 
        y: [0, -20, 0, 20, 0],
        x: [0, 10, -10, 5, 0],
        opacity: [0, 0.8, 0.5, 0.8, 0]
      }}
      transition={{
        duration: 10 + Math.random() * 10,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
    />
  );
};

const AnimatedCard = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
  >
    {children}
  </motion.div>
);

const StatCard = ({ icon: Icon, title, value, className, delay = 0 }) => (
  <AnimatedCard delay={delay}>
    <div className="relative overflow-hidden rounded-2xl h-full shadow-lg hover:shadow-xl transition-shadow">
      <FloatingParticle delay={0} top="10%" left="20%" size="30px" color="rgba(255,255,255,0.25)" />
      <FloatingParticle delay={1} top="60%" left="70%" size="40px" color="rgba(173,216,230,0.25)" />
      <FloatingParticle delay={2} top="30%" left="80%" size="25px" color="rgba(221,160,221,0.3)" />
      
      <Card className={`p-6 ${className} text-white relative z-10 h-full bg-gradient-to-br hover:brightness-110 transition-all`}>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="h-full flex flex-col justify-between"
        >
          <div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <motion.h3 
              className="text-3xl font-bold mt-1"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {value}
            </motion.h3>
          </div>
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="self-end"
          >
            <Icon className="w-10 h-10 opacity-80" />
          </motion.div>
        </motion.div>
      </Card>
    </div>
  </AnimatedCard>
);

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    empruntsTotal: 0,
    empruntsEnCours: 0,
    livres: 0,
    commentaires: 0,
    auteurs: 0,
    categories: 0,
    utilisateurs: {
      total: 0,
      actifs: 0,
      avertis: 0
    },
    derniersUtilisateurs: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const [
          livresRes,
          empruntsRes,
          commentairesRes,
          auteursRes,
          categoriesRes,
          usersRes
        ] = await Promise.all([
          fetch('http://localhost:5000/api/admin/livres', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch('http://localhost:5000/api/admin/emprunts', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch('http://localhost:5000/api/admin/commentaires', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch('http://localhost:5000/api/admin/auteurs', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch('http://localhost:5000/api/admin/categories', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }),
          fetch('http://localhost:5000/api/admin/users', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          })
        ]);

        if (!livresRes.ok || !empruntsRes.ok || !commentairesRes.ok || 
            !auteursRes.ok || !categoriesRes.ok || !usersRes.ok) {
          throw new Error('Erreur lors de la récupération des données');
        }

        const [
          livresData,
          empruntsData,
          commentairesData,
          auteursData,
          categoriesData,
          usersData
        ] = await Promise.all([
          livresRes.json(),
          empruntsRes.json(),
          commentairesRes.json(),
          auteursRes.json(),
          categoriesRes.json(),
          usersRes.json()
        ]);

        const empruntsArray = Array.isArray(empruntsData.emprunts) ? empruntsData.emprunts : [];
        const usersArray = Array.isArray(usersData) ? usersData : [];

        const empruntsEnCours = empruntsArray.filter(emprunt => !emprunt.estRendu).length;
        const actifs = usersArray.filter(user => user.isActive).length;
        const avertis = usersArray.filter(user => user.nombreAvertissements > 0).length;

        const derniersUtilisateurs = [...usersArray]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setStats({
          livres: Array.isArray(livresData) ? livresData.length : 0,
          empruntsTotal: empruntsData.statistiques?.total || empruntsArray.length,
          empruntsEnCours,
          commentaires: Array.isArray(commentairesData) ? commentairesData.length : 0,
          auteurs: Array.isArray(auteursData) ? auteursData.length : 0,
          categories: Array.isArray(categoriesData) ? categoriesData.length : 0,
          utilisateurs: {
            total: usersArray.length,
            actifs,
            avertis
          },
          derniersUtilisateurs
        });

      } catch (error) {
        console.error('Erreur:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Préparation des données pour les graphiques
  const pieData = [
    { name: 'Actifs', value: stats.utilisateurs.actifs, color: '#8b5cf6' },
    { name: 'Inactifs', value: stats.utilisateurs.total - stats.utilisateurs.actifs, color: '#f97316' },
    { name: 'Avertis', value: stats.utilisateurs.avertis, color: '#eab308' }
  ];

  const pieDataEmprunts = [
    { name: 'En cours', value: stats.empruntsEnCours, color: '#3b82f6' },
    { name: 'Terminés', value: stats.empruntsTotal - stats.empruntsEnCours, color: '#10b981' }
  ];

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erreur ! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen"
    >
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
          Vue d'ensemble
        </h2>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
          <StatCard
            icon={LibraryBig}
            title="Livres disponibles"
            value={stats.livres}
            className="from-indigo-500 to-indigo-600"
            delay={0}
          />
        </motion.div>
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
          <StatCard
            icon={Users}
            title="Utilisateurs"
            value={stats.utilisateurs.total}
            className="from-green-500 to-green-600"
            delay={1}
          />
        </motion.div>
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
          <StatCard
            icon={PenLine}
            title="Auteurs"
            value={stats.auteurs}
            className="from-yellow-500 to-yellow-600"
            delay={2}
          />
        </motion.div>
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
          <StatCard
            icon={MessageSquareText}
            title="Commentaires"
            value={stats.commentaires}
            className="from-rose-500 to-rose-600"
            delay={3}
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="space-y-6">
          <motion.div whileHover={{ scale: 1.02 }}>
            <StatCard
              icon={BookCheck}
              title="Total Emprunts"
              value={stats.empruntsTotal}
              className="from-purple-600 to-indigo-600"
              delay={4}
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }}>
            <StatCard
              icon={BookCheck}
              title="Emprunts en cours"
              value={stats.empruntsEnCours}
              className="from-blue-600 to-indigo-500"
              delay={5}
            />
          </motion.div>
        </div>

        <motion.div 
          className="lg:col-span-2"
          whileHover={{ scale: 1.01 }}
        >
          <Card className="p-6 shadow-lg rounded-xl border border-gray-200 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <BookCheck className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Statut des emprunts</h3>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDataEmprunts}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={60}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieDataEmprunts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend layout="vertical" verticalAlign="middle" align="right" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col lg:flex-row gap-6"
      >
        <motion.div 
          className="w-full lg:w-[66%]"
          whileHover={{ scale: 1.005 }}
        >
          <Card className="p-6 shadow-lg rounded-xl border border-gray-200 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Derniers utilisateurs inscrits</h3>
            </div>
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[25%]">Nom</TableHead>
                    <TableHead className="w-[30%]">Email</TableHead>
                    <TableHead className="w-[20%]">Inscription</TableHead>
                    <TableHead className="w-[25%] text-right">Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.derniersUtilisateurs.length > 0 ? (
                    stats.derniersUtilisateurs.map((user, index) => (
                      <motion.tr 
                        key={user._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                        whileHover={{ scale: 1.01 }}
                      >
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell className="text-gray-600">{user.email}</TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                        </TableCell>
                        <TableCell className="text-right">
                          {user.nombreAvertissements > 0 ? (
                            <Badge variant="warning" className="justify-end">
                              {user.nombreAvertissements} avertissement(s)
                            </Badge>
                          ) : (
                            <Badge variant={user.isActive ? "success" : "destructive"} className="justify-end">
                              {user.isActive ? "Actif" : "Inactif"}
                            </Badge>
                          )}
                        </TableCell>
                      </motion.tr>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                        Aucun utilisateur trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>

        <motion.div 
          className="w-full lg:w-[34%]"
          whileHover={{ scale: 1.01 }}
        >
          <Card className="p-6 shadow-lg rounded-xl border border-gray-200 bg-white/90 backdrop-blur-sm h-full">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold">Statut des utilisateurs</h3>
            </div>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    innerRadius={35}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  {/* <Legend layout="vertical" verticalAlign="middle" align="right" /> */}
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;