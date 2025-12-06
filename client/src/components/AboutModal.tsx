import { X, Linkedin, Mail, Phone, Code, Briefcase, GraduationCap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { Suspense } from "react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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

const skills = [
  "Java 1.8", "Spring Framework", "SQL", "RESTful APIs", 
  "React", "Node.js", "TypeScript", "MySQL", "Cloud Solutions"
];

const experience = [
  { company: "PODTECH", role: "Software Developer", period: "May 2025 - Present" },
  { company: "LTIMindtree", role: "Software Engineer", period: "Nov 2024 - Jan 2025" },
  { company: "byteXL", role: "DSA & OOPs Instructor", period: "Aug 2024 - Nov 2024" },
  { company: "Universal Justice Times", role: "Full-Stack Developer", period: "Jul 2023 - Nov 2023" },
];

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={onClose}
          data-testid="modal-about"
        >
          <div className="absolute inset-0 bg-background/90 backdrop-blur-xl" />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 max-w-3xl w-full my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <About3DBackground />
            
            <Card className="glass shadow-3d border-primary/20 overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-3 z-20"
                onClick={onClose}
                data-testid="button-close-about"
              >
                <X className="w-5 h-5" />
              </Button>

              <CardContent className="p-6 md:p-8">
                <div className="flex flex-col items-center text-center">
                  <motion.div 
                    className="relative mb-6"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
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

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-2xl md:text-3xl font-display font-bold bg-gradient-to-r from-foreground via-primary to-purple-500 bg-clip-text text-transparent mb-1" data-testid="text-about-name">
                      Sahil Vashisht
                    </h2>
                    <p className="text-base text-muted-foreground font-medium mb-2" data-testid="text-about-tagline">
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

                  <motion.div 
                    className="w-full max-w-lg mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-sm text-foreground/80 leading-relaxed" data-testid="text-about-description">
                      Passionate Java Software Developer with expertise in <span className="text-primary font-medium">Java 1.8</span>, <span className="text-primary font-medium">Spring Framework</span>, and <span className="text-primary font-medium">SQL</span>. 
                      I specialize in building scalable, efficient, and user-focused software solutions. 
                      Whether it's crafting RESTful APIs or optimizing backend systems, I thrive on solving challenges and delivering impactful results.
                    </p>
                  </motion.div>

                  <motion.div 
                    className="w-full mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h3 className="text-sm font-display font-semibold text-muted-foreground mb-3 flex items-center justify-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      Skills & Technologies
                    </h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {skills.map((skill, idx) => (
                        <motion.div
                          key={skill}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + idx * 0.05 }}
                        >
                          <Badge variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div 
                    className="w-full mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h3 className="text-sm font-display font-semibold text-muted-foreground mb-3 flex items-center justify-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      Experience
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {experience.map((exp, idx) => (
                        <motion.div
                          key={exp.company}
                          initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + idx * 0.1 }}
                          className="p-3 rounded-lg bg-muted/30 border border-border/50 text-left"
                        >
                          <p className="font-medium text-sm text-foreground">{exp.company}</p>
                          <p className="text-xs text-muted-foreground">{exp.role}</p>
                          <p className="text-xs text-primary/70">{exp.period}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div 
                    className="flex flex-wrap justify-center gap-3 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open('https://www.linkedin.com/in/sahilvashisht00', '_blank')}
                      data-testid="button-linkedin"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open('mailto:vashishtsahil99@gmail.com', '_blank')}
                      data-testid="button-email"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open('tel:9625107920', '_blank')}
                      data-testid="button-phone"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      962-510-7920
                    </Button>
                  </motion.div>

                  <motion.div 
                    className="w-full pt-4 border-t border-border/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <p className="text-sm text-muted-foreground" data-testid="text-about-footer">
                      Crafted with passion by <span className="text-primary font-medium">Sahil Vashisht</span>
                    </p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      Building innovative software solutions since 2022
                    </p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
