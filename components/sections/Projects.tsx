import type { Project } from "@/lib/content-extractor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, PlayCircle, Code, Database, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectsProps {
  projects: Project[];
}

const iconMap: Record<string, React.ReactNode> = {
  blog: <Layout className="h-8 w-8" />,
  dashboard: <Code className="h-8 w-8" />,
  database: <Database className="h-8 w-8" />,
};

const statusMap: Record<Project["status"], { icon: React.ReactNode; label: string; color: string }> = {
  completed: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    label: "완료",
    color: "text-green-600 dark:text-green-400",
  },
  "in-progress": {
    icon: <Clock className="h-4 w-4" />,
    label: "진행 중",
    color: "text-blue-600 dark:text-blue-400",
  },
  planned: {
    icon: <PlayCircle className="h-4 w-4" />,
    label: "예정",
    color: "text-gray-600 dark:text-gray-400",
  },
};

export default function Projects({ projects }: ProjectsProps) {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">프로젝트</h2>
          <p className="text-lg text-muted-foreground">
            진행 중인 프로젝트와 완료된 작업을 소개합니다.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const statusInfo = statusMap[project.status];
            const projectIcon = project.icon ? iconMap[project.icon] : <Code className="h-8 w-8" />;

            return (
              <Card
                key={project.id}
                className="group relative flex flex-col overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* 배경 패턴 */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 opacity-0 transition-opacity group-hover:opacity-100" />

                <CardHeader className="relative">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="rounded-lg bg-primary/10 p-3 text-primary">
                      {projectIcon}
                    </div>
                    <div className={cn("flex items-center gap-1 text-sm font-medium", statusInfo.color)}>
                      {statusInfo.icon}
                      <span>{statusInfo.label}</span>
                    </div>
                  </div>
                  <CardTitle className="mb-2">{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>

                <CardContent className="relative flex-1 space-y-4">
                  {/* 스택 */}
                  <div>
                    <div className="mb-2 text-xs font-semibold text-muted-foreground">기술 스택</div>
                    <div className="flex flex-wrap gap-2">
                      {project.stack.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* 성과 */}
                  {project.achievements && project.achievements.length > 0 && (
                    <div>
                      <div className="mb-2 text-xs font-semibold text-muted-foreground">주요 성과</div>
                      <ul className="space-y-1">
                        {project.achievements.map((achievement, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            <span className="font-medium text-primary">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 날짜 */}
                  {project.date && (
                    <div className="pt-2 text-xs text-muted-foreground border-t">
                      {new Date(project.date).toLocaleDateString("ko-KR")}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

