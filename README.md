# Web-Project-Final

Hướng dẫn cài đặt và chạy dự án Fullstack (frontend + backend).

## Tổng quan

Thư mục chính:
- `frontend/` — ứng dụng client (Vite + React + TypeScript)
- `backend/` — (hiện đang trống)

> Ghi chú: `backend/` chưa có mã nguồn. Nếu bạn muốn triển khai API, có thể thêm một project Node/Express, Nest, hoặc bất kỳ framework nào bạn thích vào thư mục này.

## Yêu cầu

- Node.js 18.x hoặc mới hơn (LTS)
- npm hoặc pnpm/yarn (README này dùng npm làm ví dụ)

## Phối hợp nhóm & Git workflow

Mục đích của phần này là để tất cả thành viên hiểu cách làm việc với codebase: frontend và backend là hai thư mục độc lập chứa mã nguồn. Trước khi bắt đầu code, hãy luôn chuyển (checkout) sang branch chung tương ứng (`frontend` hoặc `backend`) rồi tạo branch cá nhân từ branch đó.

Quy tắc chung

- Mỗi thư mục (`frontend/`, `backend/`) có branch chủ để phát triển riêng — ví dụ `frontend` cho client, `backend` cho server.
- Khi bắt đầu làm việc ở client: checkout `frontend` rồi tạo branch cá nhân từ đó.
- Khi bắt đầu làm việc ở backend: checkout `backend` rồi tạo branch cá nhân từ đó.
- Tên branch cá nhân theo quy ước: `<folder>/<yourname>/<short-description>` hoặc `<folder>/<type>/<short-desc>`.
	- Ví dụ: `frontend/khanshh/feature-login` hoặc `backend/anhcuong/bugfix-auth`

Ví dụ mở đầu (lần đầu clone project)

```bash
# clone repo
git clone <repo-url>
cd Web-Project-Final

# lấy tất cả branch từ remote
git fetch origin --prune

# làm việc trên frontend: bắt đầu từ branch 'frontend'
git checkout frontend
git pull origin frontend

# tạo branch cá nhân từ frontend
git checkout -b frontend/<yourname>/short-desc

# code, commit, push
git add .
git commit -m "feat: add login form"
git push -u origin frontend/<yourname>/short-desc

# mở Pull Request (PR) từ branch cá nhân -> target branch: frontend
```

Quy trình cập nhật branch cá nhân khi branch chính có thay đổi

```bash
# trong branch cá nhân
git fetch origin

# cập nhật branch frontend từ remote
git checkout frontend
git pull --rebase origin frontend

# trở lại branch cá nhân và rebase (hoặc merge) để cập nhật
git checkout frontend/<yourname>/short-desc
git rebase origin/frontend
# hoặc nếu muốn merge
# git merge origin/frontend

# resolve conflict nếu có, sau đó push lại
git push --force-with-lease
```

Ghi chú quan trọng

- Luôn tạo branch cá nhân từ branch `frontend` hoặc `backend` tương ứng — không tạo trực tiếp từ `main` nếu bạn làm feature cho frontend/backend.
- Khi mở PR, target branch phải là `frontend` nếu thay đổi liên quan frontend, hoặc `backend` nếu thay đổi backend.
- Đặt tiêu đề PR rõ ràng, mô tả thay đổi, và liên kết issue nếu có.
- Tránh force-push trên branch chia sẻ; chỉ force-push trên branch cá nhân khi thực sự cần và luôn dùng `--force-with-lease`.

Ví dụ nhanh cho backend

```bash
git checkout backend
git pull origin backend
git checkout -b backend/<yourname>/fix-auth
# code, test, commit
git push -u origin backend/<yourname>/fix-auth
# mở PR -> target: backend
```

Nếu nhóm muốn, chúng ta có thể thêm Git hooks (pre-commit) hoặc CI checks để enforce lint/tests trước khi merge.


## Cài đặt & chạy frontend

1. Mở terminal và chuyển vào thư mục frontend:

```bash
cd frontend
```

2. Cài phụ thuộc:

```bash
npm install
```

3. Chạy môi trường phát triển (Vite):

```bash
npm run dev
```

4. Build để production:

```bash
npm run build
```

5. Xem bản build cục bộ (preview):

```bash
npm run preview
```

Các script có trong `frontend/package.json`:

- `dev` — chạy vite dev server
- `build` — build (kết hợp tsc -b và vite build)
- `preview` — preview build
- `lint` — chạy eslint

Mặc định Vite chạy trên cổng 5173; nếu cần thay đổi, chỉnh cấu hình trong `vite.config.ts`.

## Backend (FastAPI)

Backend hiện tại sử dụng FastAPI với entrypoint ở `backend/app/main.py`. Dưới đây là hướng dẫn chạy và các ghi chú quan trọng dựa trên cấu hình hiện tại trong `app/config.py` và file `.env`.

Yêu cầu

- Python 3.10+ (hoặc 3.9+)
- pip

Thiết lập nhanh

```bash
cd backend
# tạo virtualenv (dùng tên venv trong repository này)
python3 -m venv venv
source venv/bin/activate

# cài phụ thuộc từ requirements.txt
pip install --upgrade pip
pip install -r requirements.txt
```

Chạy ứng dụng (development)

```bash
# từ thư mục backend, khi venv đã được activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 5000

# hoặc bằng cách chạy module trực tiếp (script trong app/main.py khởi động uvicorn khi __main__)
python -m app.main
```

Các giá trị mặc định

- PORT mặc định là `5000` (xem `backend/.env` và `app/config.py`).
- FRONTEND_URL mặc định là `http://localhost:5173` (để cấu hình CORS).
- DEBUG mặc định = `True` trong cấu hình hiện tại.

API docs

- Swagger UI: http://localhost:5000/docs
- ReDoc: http://localhost:5000/redoc

File quan trọng

- `backend/app/main.py` — entrypoint FastAPI
- `backend/app/config.py` — cấu hình (đọc `.env` bằng pydantic-settings)
- `backend/requirements.txt` — dependencies
- `backend/.env` — biến môi trường (không commit các bí mật)

Ví dụ `.env` (đã có trong repo):

```env
PORT=5000
DEBUG=True
DATABASE_URL=sqlite:///./test.db
SECRET_KEY=your-super-secret-key-change-this-in-production
FRONTEND_URL=http://localhost:5173
```

Git ignore

Thêm các mục sau nếu chưa có trong `.gitignore` để tránh commit các file tạm:

- `backend/venv/`
- `backend/.env`
- `backend/__pycache__/`

Gợi ý deploy & mở rộng

- Sử dụng `gunicorn -k uvicorn.workers.UvicornWorker` cho môi trường production khi cần nhiều worker.
- Thêm Alembic để migration DB nếu dùng PostgreSQL hoặc các DB khác.
- Thêm Dockerfile / docker-compose nếu muốn container hóa backend.

Kết nối frontend

Mặc định frontend (Vite) chạy ở `http://localhost:5173`. Để frontend gọi API backend local, đặt trong `frontend/.env` hoặc cấu hình Vite `VITE_API_URL` thành:

```
VITE_API_URL=http://localhost:5000
```

Nếu muốn, tôi có thể:
- Thêm script khởi tạo môi trường (`scripts/setup_backend.sh`) để tự động tạo venv và cài dependencies.
- Tạo Dockerfile/compose mẫu hoặc CI workflow.
Hãy cho biết bạn muốn tôi tạo thêm file mẫu nào.

## Biến môi trường

Nếu dự án cần biến môi trường, tạo file `.env` trong `frontend/` hoặc `backend/` tương ứng và thêm vào `.gitignore` (ví dụ `.env`, `.env.local`). Ví dụ biến cho frontend:

```env
VITE_API_URL=http://localhost:4000
```

Trong mã frontend (Vite), truy cập bằng `import.meta.env.VITE_API_URL`.

## Troubleshooting

- Nếu gặp lỗi cài đặt, thử xóa `node_modules` và `package-lock.json` rồi chạy `npm install` lại.
- Kiểm tra phiên bản Node với `node -v`.

## Quy ước đóng góp

- Tạo branch nhánh tính năng: `git checkout -b feat/<mô-tả>`
- Mở PR vào `main` và mô tả ngắn gọn thay đổi.

## License

Để trống hoặc thêm license nếu cần (ví dụ MIT).

---

Nếu bạn muốn, tôi có thể:
- Thêm mẫu backend (Express) với endpoint cơ bản.
- Thêm script Docker hoặc workflow CI/CD mẫu.

Xin cho biết nếu muốn tôi thêm phần nào.
# Web-Project-Final