import { addProfileBadge, BadgePosition, type ProfileBadge, removeProfileBadge } from "@api/Badges";
import { definePluginSettings, migratePluginSettings } from "@api/Settings";
import { LinkButton } from "@components/Button";
import { Card } from "@components/Card";
import { Link } from "@components/Link";
import { Paragraph } from "@components/Paragraph";
import definePlugin, { OptionType } from "@utils/types";
import { UserStore } from "@webpack/common";

import { badgeGroups } from "./catalog";

const pluginName = "AllBadgesVencord";
const github = "https://github.com/Adriano-leao-dev";
const repository = github + "/allbadges-vencord";
const catalog = badgeGroups.flatMap<readonly [string, string, string]>(group => group.badges);

migratePluginSettings(pluginName, "B4LordBadges");

const settings = definePluginSettings({
    showExtraBadges: {
        type: OptionType.BOOLEAN,
        description: "Mostrar as insígnias extras selecionadas",
        default: true,
    },
    ...Object.fromEntries(catalog.map(([id, description]) => [
        id,
        { type: OptionType.BOOLEAN as const, description, default: false, hidden: true },
    ])),
});

function About() {
    const selected = settings.use();
    return (
        <div style={{ display: "grid", gap: "12px" }}>
            <Card variant="normal">
                <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                    <img width={40} height={40} style={{ borderRadius: "50%" }}
                        src="https://avatars.githubusercontent.com/u/176540845?s=80" alt="Foto de B4_Lord" />
                    <div>
                        <Paragraph weight="semibold">AllBadges Vencord</Paragraph>
                        <Link href={github}>B4_Lord no GitHub</Link>
                    </div>
                </div>
                <Paragraph style={{ marginTop: "12px" }}>
                    Abra uma categoria, marque as insígnias que quer mostrar e reabra seu perfil para conferir.
                    Sua seleção é salva e aparece localmente.
                </Paragraph>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                    <LinkButton href={repository + "/tree/main/AllBadgesVencord"}>Ver código-fonte</LinkButton>
                    <LinkButton href={repository + "#instalação"}>Como usar</LinkButton>
                </div>
            </Card>
            {badgeGroups.map(({ label, badges }) => (
                <details key={label}>
                    <summary style={{ cursor: "pointer", padding: "6px 0" }}>
                        {label} · {badges.filter(([id]) => selected[id]).length}/{badges.length}
                    </summary>
                    <div style={{ display: "grid", gap: "4px", padding: "4px 0 8px 16px" }}>
                        {badges.map(([id, description, iconSrc]) => (
                            <label key={id} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                                <input type="checkbox" checked={selected[id] === true}
                                    onChange={event => { settings.store[id] = event.currentTarget.checked; }} />
                                <img loading="lazy" src={iconSrc} alt="" width={20} height={20} />
                                <span>{description}</span>
                            </label>
                        ))}
                    </div>
                </details>
            ))}
        </div>
    );
}

const provider: ProfileBadge = {
    id: "allbadges-vencord-provider",
    position: BadgePosition.START,
    shouldShow: ({ userId }) =>
        settings.store.showExtraBadges && userId === UserStore.getCurrentUser()?.id,
    getBadges: () => catalog
        .filter(([id]) => settings.store[id] === true)
        .map(([id, description, iconSrc]) => ({ id, description, iconSrc, name: description })),
};

export default definePlugin({
    name: pluginName,
    description: "Escolha as insígnias extras que aparecem no seu perfil do Discord, incluindo variantes e níveis.",
    authors: [{ name: "B4_Lord", id: 0n }],
    tags: ["Appearance"],
    dependencies: ["BadgeAPI"],
    settings,
    settingsAboutComponent: About,

    start() {
        addProfileBadge(provider);
    },

    stop() {
        removeProfileBadge(provider);
    },
});
