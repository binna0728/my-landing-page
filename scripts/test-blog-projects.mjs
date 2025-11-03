import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// .env.local 파일 읽기
try {
  const envPath = join(__dirname, '..', '.env.local');
  const envFile = readFileSync(envPath, 'utf-8');
  envFile.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=');
      if (key && value) {
        process.env[key.trim()] = value.trim();
      }
    }
  });
} catch (err) {
  console.error('환경변수 파일 읽기 실패:', err.message);
  process.exit(1);
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testBlogPosts() {
  console.log('\n=== 📝 블로그 포스트 테스트 ===\n');
  
  try {
    // 전체 블로그 포스트 조회
    const { data: allPosts, error: allError } = await supabase
      .from('blog_posts')
      .select('id, title, slug, status, publish_date')
      .order('publish_date', { ascending: false });
    
    if (allError) {
      console.error('❌ 전체 블로그 조회 실패:', allError.message);
      return false;
    }
    
    console.log(`✅ 전체 블로그 포스트: ${allPosts?.length || 0}개`);
    
    // Published 블로그 포스트만 조회
    const { data: publishedPosts, error: pubError } = await supabase
      .from('blog_posts')
      .select('id, title, slug, status, publish_date, description, tags')
      .eq('status', 'published')
      .order('publish_date', { ascending: false });
    
    if (pubError) {
      console.error('❌ Published 블로그 조회 실패:', pubError.message);
      return false;
    }
    
    console.log(`✅ Published 블로그 포스트: ${publishedPosts?.length || 0}개\n`);
    
    if (publishedPosts && publishedPosts.length > 0) {
      console.log('📄 Published 포스트 목록:');
      publishedPosts.slice(0, 5).forEach((post, idx) => {
        console.log(`   ${idx + 1}. [${post.id}] ${post.title}`);
        console.log(`      Slug: ${post.slug || '(없음)'}`);
        console.log(`      날짜: ${post.publish_date || '(없음)'}`);
        if (post.tags && post.tags.length > 0) {
          console.log(`      태그: ${post.tags.join(', ')}`);
        }
        console.log('');
      });
      
      // 첫 번째 포스트 상세 조회 테스트
      const firstPost = publishedPosts[0];
      const { data: detailPost, error: detailError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', firstPost.slug)
        .single();
      
      if (detailError) {
        console.error(`❌ 상세 조회 실패 (slug: ${firstPost.slug}):`, detailError.message);
        return false;
      }
      
      if (detailPost && detailPost.content) {
        console.log(`✅ 상세 조회 성공: "${detailPost.title}"`);
        console.log(`   내용 길이: ${detailPost.content.length}자\n`);
      }
    } else {
      console.log('⚠️  Published 블로그 포스트가 없습니다.\n');
    }
    
    return true;
  } catch (error) {
    console.error('❌ 블로그 테스트 실패:', error.message);
    return false;
  }
}

async function testProjects() {
  console.log('\n=== 🚀 프로젝트 테스트 ===\n');
  
  try {
    // 전체 프로젝트 조회
    const { data: allProjects, error: allError } = await supabase
      .from('projects')
      .select('id, title, slug, status, created_at')
      .order('created_at', { ascending: false });
    
    if (allError) {
      console.error('❌ 전체 프로젝트 조회 실패:', allError.message);
      return false;
    }
    
    console.log(`✅ 전체 프로젝트: ${allProjects?.length || 0}개`);
    
    // Published 프로젝트만 조회
    const { data: publishedProjects, error: pubError } = await supabase
      .from('projects')
      .select('id, title, slug, status, created_at, description, tags, award')
      .eq('status', 'published')
      .order('created_at', { ascending: false });
    
    if (pubError) {
      console.error('❌ Published 프로젝트 조회 실패:', pubError.message);
      return false;
    }
    
    console.log(`✅ Published 프로젝트: ${publishedProjects?.length || 0}개\n`);
    
    if (publishedProjects && publishedProjects.length > 0) {
      console.log('📄 Published 프로젝트 목록:');
      publishedProjects.forEach((project, idx) => {
        console.log(`   ${idx + 1}. [${project.id}] ${project.title}`);
        console.log(`      Slug: ${project.slug || '(없음)'}`);
        if (project.award) {
          console.log(`      🏆 수상: ${project.award}`);
        }
        if (project.tags && project.tags.length > 0) {
          console.log(`      태그: ${project.tags.join(', ')}`);
        }
        console.log('');
      });
      
      // 첫 번째 프로젝트 상세 조회 테스트
      const firstProject = publishedProjects[0];
      const { data: detailProject, error: detailError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', firstProject.slug)
        .single();
      
      if (detailError && detailError.code !== 'PGRST116') {
        // PGRST116은 결과가 없을 때 발생
        console.error(`❌ 상세 조회 실패 (slug: ${firstProject.slug}):`, detailError.message);
        return false;
      }
      
      if (detailProject) {
        if (detailProject.slug) {
          // slug로 조회
          const { data: slugProject, error: slugError } = await supabase
            .from('projects')
            .select('*')
            .eq('slug', detailProject.slug)
            .single();
          
          if (slugError) {
            console.error(`❌ Slug로 조회 실패:`, slugError.message);
            return false;
          }
          
          console.log(`✅ Slug 조회 성공: "${slugProject.title}"`);
        }
        
        if (detailProject.content) {
          console.log(`   내용 길이: ${detailProject.content.length}자`);
        }
        if (detailProject.images && Array.isArray(detailProject.images)) {
          console.log(`   이미지: ${detailProject.images.length}개`);
        }
        console.log('');
      }
    } else {
      console.log('⚠️  Published 프로젝트가 없습니다.\n');
    }
    
    return true;
  } catch (error) {
    console.error('❌ 프로젝트 테스트 실패:', error.message);
    return false;
  }
}

async function testAPICalls() {
  console.log('\n=== 🌐 REST API 직접 호출 테스트 ===\n');
  
  try {
    // 블로그 API 테스트
    console.log('1. 블로그 포스트 API 호출...');
    const blogUrl = `${SUPABASE_URL}/rest/v1/blog_posts?select=*&status=eq.published&order=publish_date.desc`;
    const blogResponse = await fetch(blogUrl, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    
    if (!blogResponse.ok) {
      const errorText = await blogResponse.text();
      console.error('❌ 블로그 API 호출 실패:', blogResponse.status, errorText);
      return false;
    }
    
    const blogData = await blogResponse.json();
    console.log(`✅ 블로그 API 성공: ${Array.isArray(blogData) ? blogData.length : 0}개`);
    
    // 프로젝트 API 테스트
    console.log('2. 프로젝트 API 호출...');
    const projectUrl = `${SUPABASE_URL}/rest/v1/projects?select=*&status=eq.published&order=created_at.desc`;
    const projectResponse = await fetch(projectUrl, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });
    
    if (!projectResponse.ok) {
      const errorText = await projectResponse.text();
      console.error('❌ 프로젝트 API 호출 실패:', projectResponse.status, errorText);
      return false;
    }
    
    const projectData = await projectResponse.json();
    console.log(`✅ 프로젝트 API 성공: ${Array.isArray(projectData) ? projectData.length : 0}개\n`);
    
    return true;
  } catch (error) {
    console.error('❌ API 호출 테스트 실패:', error.message);
    return false;
  }
}

async function main() {
  console.log('========================================');
  console.log('   블로그 & 프로젝트 데이터 테스트');
  console.log('========================================');
  
  const blogResult = await testBlogPosts();
  const projectResult = await testProjects();
  const apiResult = await testAPICalls();
  
  console.log('\n========================================');
  console.log('   테스트 결과 요약');
  console.log('========================================\n');
  console.log(`📝 블로그: ${blogResult ? '✅ 통과' : '❌ 실패'}`);
  console.log(`🚀 프로젝트: ${projectResult ? '✅ 통과' : '❌ 실패'}`);
  console.log(`🌐 API 호출: ${apiResult ? '✅ 통과' : '❌ 실패'}`);
  console.log('');
  
  if (blogResult && projectResult && apiResult) {
    console.log('✅ 모든 테스트 통과!');
    process.exit(0);
  } else {
    console.log('❌ 일부 테스트 실패');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('치명적 오류:', error);
  process.exit(1);
});
