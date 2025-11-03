export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">프로젝트를 찾을 수 없습니다</h1>
        <p className="text-muted-foreground mb-4">
          요청하신 프로젝트가 존재하지 않거나 삭제되었습니다.
        </p>
      </div>
    </div>
  );
}



