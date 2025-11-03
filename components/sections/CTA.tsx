import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Github, BrainCircuit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CTA() {
  return (
    <section className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-4xl">
        <Card className="relative overflow-hidden border-2 shadow-xl">
          {/* 배경 그라데이션 */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10" />

          <CardContent className="relative p-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-primary/20 p-4">
                <BrainCircuit className="h-12 w-12 text-primary" strokeWidth={1.5} />
              </div>
            </div>

            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              다음 연구 협업을 제안합니다
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              기술을 수단으로, 생명을 중심에 두는 연구를 지향합니다.
              <br />
              의료 AI 분야의 협업과 아이디어 교환을 환영합니다.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="shadow-lg group">
                <Link href="/contact" className="flex items-center gap-2">
                  <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  연구 협업 문의
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="shadow-lg group">
                <Link href="/blog" className="flex items-center gap-2">
                  <Github className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  GitHub 보기
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

