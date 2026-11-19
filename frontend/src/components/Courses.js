"use client";

import { COURSES } from "@/data/site";
import { useApi } from "@/lib/api";
import { COLORS } from "./colors";
import SectionTitle from "./SectionTitle";

export default function Courses() {
  const { data: courses } = useApi("/api/courses", COURSES);

  return (
    <section id="khoa-hoc" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4">
        <SectionTitle eyebrow="Khoá học" title="Chọn lớp phù hợp với em">
          Lớp nhóm nhỏ hoặc kèm 1-1 · Học trực tiếp tại Hà Nội hoặc online
        </SectionTitle>

        <div className="grid gap-6 md:grid-cols-3">
          {courses.map((course) => {
            const c = COLORS[course.color] ?? COLORS.brand;
            const details = [
              { icon: "💰", label: "Học phí", value: course.price || "Liên hệ để được tư vấn" },
              { icon: "🗓️", label: "Lịch học", value: course.schedule },
              { icon: "👥", label: "Hình thức", value: course.format },
            ].filter((d) => d.value);

            return (
              <article
                key={course.id}
                className="group flex flex-col rounded-3xl bg-cream p-7 ring-1 ring-ink/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl text-3xl ${c.soft}`}>
                    {course.icon}
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold text-white ${c.solid}`}>
                    {course.level}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl font-extrabold">{course.title}</h3>
                <p className="mt-2 text-muted">{course.description}</p>
                <ul className="mt-5 flex-1 space-y-2">
                  {course.topics.map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <span className={`mt-0.5 font-bold ${c.text}`}>✓</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
                <dl className="mt-5 space-y-1.5 rounded-2xl bg-white p-4 text-sm ring-1 ring-ink/5">
                  {details.map((d) => (
                    <div key={d.label} className="flex gap-2">
                      <dt className="shrink-0">
                        {d.icon} <span className="font-semibold">{d.label}:</span>
                      </dt>
                      <dd className="text-muted">{d.value}</dd>
                    </div>
                  ))}
                </dl>
                <a
                  href="#lien-he"
                  className={`mt-6 rounded-full py-3 text-center font-semibold text-white transition group-hover:shadow-lg ${c.solid}`}
                >
                  Đăng ký tư vấn
                </a>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
