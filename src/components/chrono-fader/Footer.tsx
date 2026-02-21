import React from 'react';

export const Footer: React.FC = () => {
  return (
    <div className="flex gap-2 border-t border-[#273a3a] bg-[#0c1212] px-4 pb-6 pt-2 select-none">
      <a className="just flex flex-1 flex-col items-center justify-end gap-1 rounded-full text-primary" href="#">
        <span className="material-symbols-outlined text-primary drop-shadow-[0_0_5px_rgba(31,249,249,0.5)]">tune</span>
        <p className="text-primary text-[10px] font-medium leading-normal tracking-widest uppercase">Mixer</p>
      </a>
      <a className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#5a6b6b] hover:text-[#9bbbbb] transition-colors" href="#">
        <span className="material-symbols-outlined">description</span>
        <p className="text-[10px] font-medium leading-normal tracking-widest uppercase">Script</p>
      </a>
      <a className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#5a6b6b] hover:text-[#9bbbbb] transition-colors" href="#">
        <span className="material-symbols-outlined">library_books</span>
        <p className="text-[10px] font-medium leading-normal tracking-widest uppercase">Library</p>
      </a>
      <a className="just flex flex-1 flex-col items-center justify-end gap-1 text-[#5a6b6b] hover:text-[#9bbbbb] transition-colors" href="#">
        <span className="material-symbols-outlined">ios_share</span>
        <p className="text-[10px] font-medium leading-normal tracking-widest uppercase">Export</p>
      </a>
    </div>
  );
};
