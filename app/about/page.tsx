import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Code, Target, Heart } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "소개 — 김빛나 | AI 헬스케어 연구자",
  description: "의료 AI 연구를 공부하고 있는 김빛나의 소개 페이지",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="mx-auto max-w-4xl">
        {/* 헤더 */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold mb-8 text-foreground">🧠 소개</h1>
        </div>

        {/* 프로필 사진 및 인사말 섹션 */}
        <Card className="mb-12 overflow-hidden">
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
              {/* 프로필 사진 */}
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg">
                  <Image
                    src="/profile.png"
                    alt="김빛나 프로필 사진"
                    fill
                    className="object-cover"
                    style={{ objectPosition: '50% 20%' }}
                    priority
                  />
                </div>
              </div>

              {/* 인사말 */}
              <div className="flex-1 prose prose-lg max-w-none text-center md:text-left">
                <p className="text-lg leading-relaxed text-foreground mb-4">
                  안녕하세요. 의료 AI 연구를 공부하고 있는 <strong className="text-primary">김빛나</strong>입니다.
                </p>
                <p className="text-sm text-muted-foreground mb-4 italic">
                  국립공원과 한국기후변화센터에서 연구원으로<br />
                  동계올림픽 조직위원회에서 프로젝트 매니저(기상팀, 환경담당관실)를 한 독특한 과거가 있습니다.
                </p>
                <p className="text-lg leading-relaxed text-foreground mb-4">
                  AI가 질병을 '예측'하는 시대에서,<br />
                  저는 AI가 인간을 '이해'하는 시대를 준비하고 있습니다.
                </p>
                <p className="text-lg leading-relaxed text-foreground mb-4">
                  이 블로그는 단순한 코드 기록이 아니라,<br />
                  데이터 속에서 생명의 패턴을 찾고,<br />
                  기술이 사람을 이해하는 방식을 탐구하는 공간입니다.
                </p>
                <p className="text-lg leading-relaxed text-foreground mb-4">
                  저는 정서적 지지를 받으면 끝없이 몰입하고,<br />
                  사람을 위해 자신을 갈아넣는 INFP입니다.
                </p>
                <p className="text-lg leading-relaxed text-foreground mb-4">
                  발표 울렁증을 극복하기 위해 시작한 코딩 강의는<br />
                  씨큐브 중계센터의 강사로 이어졌고,<br />
                  지금은 부모님이 내어주신 강원도 춘천의 작은 원룸에서<br />
                  '코코딩랩'이라는 이름으로 코딩 공부방을 운영하고 있습니다.
                </p>
                <p className="text-lg leading-relaxed text-foreground">
                  아직은 부족하고,<br />
                  가끔은 '너무 퍼줘서 망해가는 중'이지만,<br />
                  그래도 사람의 가능성을 믿는 마음 하나로<br />
                  AI와 교육, 그리고 '이해하는 기술'을 공부하고 있습니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 약력 섹션 */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <CardTitle>약력</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-2">OZ 코딩스쿨 × DACON AI 헬스케어 초격차 캠프 1기</h3>
              <p className="text-muted-foreground mb-4">전공: 생명과학 기반 인공지능 응용 연구</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-3">프로젝트 경험:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>헬스케어 데이터 기반의 분석 및 시각화 미니 프로젝트 → 인사이트상 수상</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>병리영상 기반 폐암 예측 모델 개발 (석사논문 주제)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>환자 생체 신호 데이터 전처리 및 예측 모델 프로젝트 참여 (ECG → 수면무호흡 진단)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>2022 정밀의료 빅데이터 아이디어 경진대회 및 해커톤 → 최우수상 수상</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* 사용 기술 섹션 */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              <CardTitle>사용 기술</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3">언어</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Python</Badge>
                <Badge variant="secondary">JavaScript</Badge>
                <Badge variant="secondary">TypeScript</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">AI / 머신러닝</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">TensorFlow</Badge>
                <Badge variant="secondary">PyTorch</Badge>
                <Badge variant="secondary">Scikit-learn</Badge>
                <Badge variant="secondary">XGBoost</Badge>
                <Badge variant="secondary">Keras</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">데이터 분석</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Pandas</Badge>
                <Badge variant="secondary">NumPy</Badge>
                <Badge variant="secondary">Matplotlib</Badge>
                <Badge variant="secondary">Seaborn</Badge>
                <Badge variant="secondary">Plotly</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">의료 영상 처리</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">OpenCV</Badge>
                <Badge variant="secondary">MONAI</Badge>
                <Badge variant="secondary">SimpleITK</Badge>
                <Badge variant="secondary">Pillow</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">모델 해석(Explainable AI)</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">SHAP</Badge>
                <Badge variant="secondary">LIME</Badge>
                <Badge variant="secondary">Grad-CAM</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">웹 / 배포</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Next.js</Badge>
                <Badge variant="secondary">FastAPI</Badge>
                <Badge variant="secondary">Flask</Badge>
                <Badge variant="secondary">Vercel</Badge>
                <Badge variant="secondary">Docker</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">데이터베이스</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Firebase</Badge>
                <Badge variant="secondary">SQLite</Badge>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">클라우드 & 협업</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Google Colab</Badge>
                <Badge variant="secondary">AWS S3</Badge>
                <Badge variant="secondary">GitHub Actions</Badge>
                <Badge variant="secondary">Cursor</Badge>
                <Badge variant="secondary">Notion API</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 목표 섹션 */}
        <Card className="mb-12">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle>목표</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>의료 데이터 기반의 질병 예측 모델을 직접 설계하고 개선하기</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>AI 진단의 해석 가능성과 신뢰성 향상 연구</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>의료 AI의 윤리적 사용과 사람 중심 설계 방향 탐색</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* 한 줄 다짐 */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-xl font-semibold text-foreground italic text-center">
              AI가 진단을 내릴 때,
              <br />
              나는 그 안에서 '이해'를 찾는다. 🌿
              <br /><br />
              이해만으로는 부족하고,
              <br />
              기술만으로는 차갑다.
              <br />
              나는 그 둘을 잇는 사람. 🌿
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
