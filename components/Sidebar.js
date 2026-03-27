import {
  FiEdit3,
  FiGrid,
  FiHeart,
  FiImage,
  FiSearch,
  FiSidebar,
  FiUser,
  FiZap,
} from "react-icons/fi";

const menuItems = [
  { icon: FiEdit3, label: "New chat" },
  { icon: FiSearch, label: "Search chats" },
  { icon: FiImage, label: "Images" },
  { icon: FiGrid, label: "Apps" },
  { icon: FiZap, label: "Deep research" },
  { icon: FiHeart, label: "Health" },
];

export default function Sidebar({ collapsed = false, onToggle }) {
  return (
    <aside
      className={`hidden md:flex min-h-screen bg-[#0f1115] border-r border-white/10 text-white flex-col py-5 transition-all duration-200 ${
        collapsed ? "w-16 px-2" : "w-16 px-4"
      }`}
    >
      <div
        className={`flex items-center mb-8 ${collapsed ? "justify-center" : "justify-between"}`}
      >
        <button
          className="w-8 h-8 rounded-lg hover:bg-white/10 text-white/80 transition-colors"
          aria-label="Toggle sidebar"
          onClick={onToggle}
        >
          <FiSidebar className="mx-auto text-lg" />
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              className={`flex items-center rounded-lg text-white/92 hover:bg-white/8 transition-colors ${
                collapsed
                  ? "justify-center w-12 h-12 mx-auto"
                  : "gap-3 px-3 py-2 text-left"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <span className="text-white/85 shrink-0">
                <Icon size={collapsed ? 24 : 20} />
              </span>
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {collapsed ? (
        <button className="mt-auto w-10 h-10 rounded-full bg-[#0a84ff] text-white flex items-center justify-center mx-auto">
          <FiUser className="text-xl" />
        </button>
      ) : (
        <div className="mt-auto rounded-2xl border border-white/12 bg-white/2 p-4">
          <h3 className="text-white text-lg font-semibold">
            Get responses tailored to you
          </h3>
          <p className="mt-2 text-base text-white/72 leading-relaxed">
            Log in to get answers based on saved chats, plus create images and
            upload files.
          </p>
          <button className="mt-4 w-full rounded-full border border-white/18 bg-white/6 py-3 text-base font-semibold hover:bg-white/10 transition-colors">
            Log in
          </button>
        </div>
      )}
    </aside>
  );
}
