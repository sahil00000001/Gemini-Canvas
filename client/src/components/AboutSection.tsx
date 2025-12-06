import { Linkedin, Mail, Phone, Code, Briefcase, Sparkles, Database, Cloud } from "lucide-react";
import { 
  SiJavascript, SiTypescript, SiPython,
  SiSpringboot, SiReact, SiNodedotjs,
  SiPostgresql, SiMongodb,
  SiGit, SiDocker, SiKubernetes
} from "react-icons/si";
import { FaJava, FaAws } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { Suspense, useRef } from "react";

function FloatingSphere({ position, color, size }: { position: [number, number, number]; color: string; size: number }) {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[size, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function About3DBackground() {
  return (
    <div className="absolute inset-0 -z-10 opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} color="#8b5cf6" intensity={0.5} />
          <FloatingSphere position={[-2, 1.5, -2]} color="#8b5cf6" size={0.5} />
          <FloatingSphere position={[2.5, -1, -3]} color="#a855f7" size={0.4} />
          <FloatingSphere position={[-1.5, -1.5, -2]} color="#7c3aed" size={0.3} />
          <FloatingSphere position={[1, 2, -4]} color="#6366f1" size={0.6} />
        </Suspense>
      </Canvas>
    </div>
  );
}

const skillCategories = [
  {
    title: "Languages",
    icon: Code,
    skills: [
      { name: "Java", icon: FaJava, color: "#ED8B00" },
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
    ],
  },
  {
    title: "Frameworks",
    icon: Briefcase,
    skills: [
      { name: "Spring Boot", icon: SiSpringboot, color: "#6DB33F" },
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
    ],
  },
  {
    title: "Databases",
    icon: Database,
    skills: [
      { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
      { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
    ],
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    skills: [
      { name: "AWS", icon: FaAws, color: "#FF9900" },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "Kubernetes", icon: SiKubernetes, color: "#326CE5" },
      { name: "Git", icon: SiGit, color: "#F05032" },
    ],
  },
];

export function AboutSection() {
  const contentRef = useRef<HTMLDivElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <section
      className="min-h-screen relative flex items-center justify-center py-20 px-4 pt-24 bg-gradient-to-b from-background via-background/95 to-background"
    >
      <About3DBackground />

      <motion.div
        ref={contentRef}
        className="relative z-10 max-w-3xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="glass shadow-3d border-primary/20 overflow-hidden backdrop-blur-xl">
          <CardContent className="p-6 md:p-8">
            <motion.div className="flex flex-col items-center text-center" variants={containerVariants}>
              <motion.div 
                className="relative mb-6 mt-4"
                variants={itemVariants}
              >
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/60 to-purple-500/60 rounded-full blur-2xl scale-150"
                  animate={{ 
                    scale: [1.5, 1.8, 1.5],
                    opacity: [0.6, 0.8, 0.6]
                  }}
                  transition={{ repeat: Infinity, duration: 3 }}
                />
                <Avatar className="relative w-28 h-28 border-4 border-primary/40 shadow-lg">
                  <AvatarFallback className="text-3xl font-display font-bold bg-gradient-to-br from-primary via-purple-500 to-pink-500 text-white">
                    SV
                  </AvatarFallback>
                </Avatar>
                <motion.div
                  className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-primary shadow-lg"
                  animate={{ rotate: [0, 360] }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4 text-white" />
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <h2 className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-foreground via-primary to-purple-500 bg-clip-text text-transparent mb-1">
                  Sahil Vashisht
                </h2>
                <p className="text-base text-muted-foreground font-medium mb-2">
                  Software Engineer @ PODTECH
                </p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <Code className="w-3 h-3 mr-1" />
                    Java Developer
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                    <Briefcase className="w-3 h-3 mr-1" />
                    Full-Stack
                  </Badge>
                </div>
              </motion.div>

              <motion.div className="w-full max-w-lg mb-6" variants={itemVariants}>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Passionate Java Software Developer with expertise in <span className="text-primary font-medium">Java 1.8</span>, <span className="text-primary font-medium">Spring Framework</span>, and <span className="text-primary font-medium">SQL</span>. 
                  I specialize in building scalable, efficient, and user-focused software solutions. 
                  Whether it's crafting RESTful APIs or optimizing backend systems, I thrive on solving challenges and delivering impactful results.
                </p>
              </motion.div>

              <motion.div className="w-full mb-6" variants={itemVariants}>
                <h3 className="text-sm font-display font-semibold text-muted-foreground mb-4 flex items-center justify-center gap-2">
                  <Code className="w-4 h-4" />
                  Skills & Technologies
                </h3>
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left"
                  variants={containerVariants}
                >
                  {skillCategories.map((category) => (
                    <motion.div
                      key={category.title}
                      variants={itemVariants}
                      className="bg-background/50 rounded-lg p-3 border border-border/50 hover:border-primary/30 transition-colors duration-300"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <category.icon className="w-4 h-4 text-primary" />
                        <span className="text-xs font-semibold text-foreground">{category.title}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {category.skills.map((skill, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 border border-border/30 hover:border-primary/50 transition-colors duration-200"
                            title={skill.name}
                          >
                            <skill.icon className="w-3.5 h-3.5" style={{ color: skill.color }} />
                            <span className="text-xs text-foreground/80">{skill.name}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div className="flex flex-wrap justify-center gap-3 mb-6" variants={itemVariants}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open('https://www.linkedin.com/in/sahilvashisht00', '_blank')}
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  LinkedIn
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open('mailto:vashishtsahil99@gmail.com', '_blank')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => window.open('tel:9625107920', '_blank')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  962-510-7920
                </Button>
              </motion.div>

              <motion.div className="w-full pt-4 border-t border-border/50" variants={itemVariants}>
                <p className="text-sm text-muted-foreground">
                  Crafted with passion by <span className="text-primary font-medium">Sahil Vashisht</span>
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Building innovative software solutions since 2022
                </p>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}
